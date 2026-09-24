// Tribu : albums photo/vidéo partagés en pleine qualité.
// Cloudflare Worker + R2 (fichiers) + D1 (métadonnées).

const PART_SIZE = 25 * 1024 * 1024; // < limite de 100 Mo par requête Workers (plan gratuit)
const MAX_FILE = 20 * 1024 * 1024 * 1024; // 20 Go par fichier, garde-fou
const SESSION_DAYS = 30;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Une seule adresse : www.lesphotosdetontontibs.com renvoie vers lesphotosdetontontibs.com
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    const p = url.pathname;
    try {
      if (p.startsWith('/a/')) {
        return env.ASSETS.fetch(new Request(new URL('/album', url), request));
      }
      if (p.startsWith('/api/')) return await api(request, env, url);
      return env.ASSETS.fetch(request);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: 'Erreur serveur' }, 500);
    }
  },
};

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function api(request, env, url) {
  const m = request.method;
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // sans "api"

  // ---------- Auth admin ----------
  if (parts[0] === 'login' && m === 'POST') {
    const { password } = await request.json();
    if (!env.ADMIN_PASSWORD) throw new HttpError(500, 'ADMIN_PASSWORD non configuré');
    if (!password || !(await safeEqual(password, env.ADMIN_PASSWORD))) {
      await sleep(600);
      throw new HttpError(401, 'Mot de passe incorrect');
    }
    const exp = Date.now() + SESSION_DAYS * 864e5;
    const sig = await hmac(env, `admin|${exp}`);
    return json({ ok: true }, 200, {
      'Set-Cookie': `tribu_admin=${exp}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`,
    });
  }
  if (parts[0] === 'logout') {
    return json({ ok: true }, 200, { 'Set-Cookie': 'tribu_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
  }
  if (parts[0] === 'me') return json({ admin: await isAdmin(request, env) });

  // ---------- Admin ----------
  if (parts[0] === 'admin') {
    if (!(await isAdmin(request, env))) throw new HttpError(401, 'Non connecté');
    return adminApi(request, env, parts.slice(1), m);
  }

  // ---------- Public (par lien) ----------
  if (parts[0] === 'a' && parts[1]) {
    // tolère un caractère parasite collé au lien (ponctuation, espace insécable…)
    const tok = (decodeURIComponent(parts[1]).match(/[A-Za-z0-9]{24}/) || [parts[1]])[0];
    const album = await env.DB.prepare('SELECT * FROM albums WHERE token = ?').bind(tok).first();
    if (!album) throw new HttpError(404, 'Album introuvable');
    return publicApi(request, env, album, parts.slice(2), m);
  }

  throw new HttpError(404, 'Introuvable');
}

// ======================= ADMIN =======================
async function adminApi(request, env, parts, m) {
  if (parts[0] === 'albums' && !parts[1]) {
    if (m === 'GET') {
      const { results } = await env.DB.prepare(`
        SELECT a.*, COUNT(md.id) AS count, COALESCE(SUM(md.size),0) AS bytes,
          (SELECT id FROM media WHERE album_id = a.id AND status='ready' AND has_thumb=1 ORDER BY created_at DESC LIMIT 1) AS cover
        FROM albums a LEFT JOIN media md ON md.album_id = a.id AND md.status='ready'
        GROUP BY a.id ORDER BY a.created_at DESC`).all();
      return json({ albums: results });
    }
    if (m === 'POST') {
      const { title } = await request.json();
      const t = String(title || '').trim().slice(0, 120);
      if (!t) throw new HttpError(400, 'Titre requis');
      const album = { id: rid(12), title: t, token: rid(24), uploads_open: 1, created_at: Date.now() };
      await env.DB.prepare('INSERT INTO albums (id,title,token,uploads_open,created_at) VALUES (?,?,?,?,?)')
        .bind(album.id, album.title, album.token, 1, album.created_at).run();
      return json({ album });
    }
  }
  if (parts[0] === 'albums' && parts[1]) {
    const album = await env.DB.prepare('SELECT * FROM albums WHERE id = ?').bind(parts[1]).first();
    if (!album) throw new HttpError(404, 'Album introuvable');
    if (parts[2] === 'rotate-link' && m === 'POST') {
      const token = rid(24);
      await env.DB.prepare('UPDATE albums SET token = ? WHERE id = ?').bind(token, album.id).run();
      return json({ token });
    }
    if (m === 'PATCH') {
      const body = await request.json();
      const title = body.title != null ? String(body.title).trim().slice(0, 120) || album.title : album.title;
      const open = body.uploads_open != null ? (body.uploads_open ? 1 : 0) : album.uploads_open;
      await env.DB.prepare('UPDATE albums SET title = ?, uploads_open = ? WHERE id = ?').bind(title, open, album.id).run();
      return json({ ok: true });
    }
    if (m === 'DELETE') {
      await deletePrefix(env, `albums/${album.id}/`);
      await env.DB.batch([
        env.DB.prepare('DELETE FROM media WHERE album_id = ?').bind(album.id),
        env.DB.prepare('DELETE FROM albums WHERE id = ?').bind(album.id),
      ]);
      return json({ ok: true });
    }
  }
  throw new HttpError(404, 'Introuvable');
}

// ======================= PUBLIC =======================
async function publicApi(request, env, album, parts, m) {
  const admin = await isAdmin(request, env);

  if (parts.length === 0 && m === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT id,name,type,kind,size,uploader,owner_hash,has_thumb,has_preview,width,height,duration,taken_at,created_at
       FROM media WHERE album_id = ? AND status = 'ready' ORDER BY COALESCE(taken_at, created_at) ASC`
    ).bind(album.id).all();
    return json({
      album: { title: album.title, uploads_open: !!album.uploads_open, part_size: PART_SIZE, created_at: album.created_at },
      admin,
      media: results,
    });
  }

  // --- Uploads ---
  if (parts[0] === 'uploads') {
    if (!album.uploads_open && !admin) throw new HttpError(403, "L'ajout de photos est fermé sur cet album");

    if (!parts[1] && m === 'POST') {
      const b = await request.json();
      const size = Number(b.size) || 0;
      if (size <= 0 || size > MAX_FILE) throw new HttpError(400, 'Taille de fichier invalide');
      const name = String(b.name || 'fichier').replace(/[\\/\u0000-\u001f]/g, '_').slice(0, 200);
      const type = String(b.type || '').slice(0, 100) || guessType(name);
      const kind = kindOf(type, name);
      if (kind === 'other') throw new HttpError(400, 'Seules les photos et vidéos sont acceptées');
      const id = rid(16);
      const ext = (name.match(/\.[a-z0-9]{1,6}$/i) || [''])[0].toLowerCase();
      const key = `albums/${album.id}/${id}/original${ext}`;
      const mpu = await env.BUCKET.createMultipartUpload(key, {
        httpMetadata: { contentType: type, contentDisposition: disposition(name) },
      });
      const ownerHash = b.owner_key ? await sha(String(b.owner_key)) : null;
      await env.DB.prepare(`INSERT INTO media (id,album_id,key,name,type,kind,size,uploader,owner_hash,upload_id,status,width,height,duration,taken_at,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?)`).bind(
        id, album.id, key, name, type, kind, size,
        String(b.uploader || '').trim().slice(0, 60) || null, ownerHash, mpu.uploadId,
        int(b.width), int(b.height), num(b.duration), int(b.taken_at), Date.now()
      ).run();
      return json({ id, part_size: PART_SIZE, parts: Math.max(1, Math.ceil(size / PART_SIZE)) });
    }

    const media = await env.DB.prepare('SELECT * FROM media WHERE id = ? AND album_id = ?').bind(parts[1], album.id).first();
    if (!media) throw new HttpError(404, 'Fichier introuvable');

    if (parts[2] === 'part' && m === 'PUT') {
      if (media.status !== 'pending') throw new HttpError(409, 'Upload déjà terminé');
      const n = Number(new URL(request.url).searchParams.get('n'));
      if (!(n >= 1 && n <= 10000)) throw new HttpError(400, 'Numéro de partie invalide');
      const mpu = env.BUCKET.resumeMultipartUpload(media.key, media.upload_id);
      const len = Number(request.headers.get('content-length'));
      const body = len ? request.body : await request.arrayBuffer();
      const part = await mpu.uploadPart(n, body);
      return json({ partNumber: part.partNumber, etag: part.etag });
    }

    if (parts[2] === 'complete' && m === 'POST') {
      if (media.status !== 'pending') return json({ ok: true });
      const { parts: done } = await request.json();
      const mpu = env.BUCKET.resumeMultipartUpload(media.key, media.upload_id);
      const obj = await mpu.complete(done.sort((a, b) => a.partNumber - b.partNumber));
      await env.DB.prepare("UPDATE media SET status='ready', size=?, upload_id=NULL WHERE id=?").bind(obj.size, media.id).run();
      return json({ ok: true });
    }

    if ((parts[2] === 'thumb' || parts[2] === 'preview') && m === 'PUT') {
      const buf = await request.arrayBuffer();
      if (buf.byteLength > 8 * 1024 * 1024) throw new HttpError(413, 'Vignette trop lourde');
      await env.BUCKET.put(`albums/${album.id}/${media.id}/${parts[2]}.jpg`, buf, { httpMetadata: { contentType: 'image/jpeg' } });
      await env.DB.prepare(`UPDATE media SET has_${parts[2]} = 1 WHERE id = ?`).bind(media.id).run();
      return json({ ok: true });
    }

    if (!parts[2] && m === 'DELETE') {
      // abandon d'un upload en cours
      if (media.status === 'pending') {
        try { await env.BUCKET.resumeMultipartUpload(media.key, media.upload_id).abort(); } catch {}
        await deletePrefix(env, `albums/${album.id}/${media.id}/`);
        await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(media.id).run();
      }
      return json({ ok: true });
    }
  }

  // --- Médias ---
  if (parts[0] === 'media' && parts[1]) {
    const media = await env.DB.prepare("SELECT * FROM media WHERE id = ? AND album_id = ? AND status='ready'").bind(parts[1], album.id).first();
    if (!media) throw new HttpError(404, 'Fichier introuvable');

    if (m === 'DELETE' && !parts[2]) {
      const ownerKey = request.headers.get('x-owner-key');
      const isOwner = ownerKey && media.owner_hash && (await sha(ownerKey)) === media.owner_hash;
      if (!admin && !isOwner) throw new HttpError(403, 'Seule la personne qui a ajouté ce fichier peut le supprimer');
      await deletePrefix(env, `albums/${album.id}/${media.id}/`);
      await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(media.id).run();
      return json({ ok: true });
    }

    if (m === 'GET' || m === 'HEAD') {
      const which = parts[2] || 'original';
      let key;
      if (which === 'original') key = media.key;
      else if (which === 'thumb' || which === 'preview') key = `albums/${album.id}/${media.id}/${which}.jpg`;
      else throw new HttpError(404, 'Introuvable');
      return serveObject(request, env, key, media, which, new URL(request.url).searchParams.has('dl'));
    }
  }

  throw new HttpError(404, 'Introuvable');
}

async function serveObject(request, env, key, media, which, download) {
  const obj = await env.BUCKET.get(key, { range: request.headers, onlyIf: request.headers });
  if (!obj) throw new HttpError(404, 'Fichier introuvable');
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set('etag', obj.httpEtag);
  h.set('accept-ranges', 'bytes');
  h.set('cache-control', which === 'original' ? 'private, max-age=86400' : 'private, max-age=31536000, immutable');
  if (which === 'original') h.set('content-disposition', disposition(media.name, download));
  if (!('body' in obj) || !obj.body) return new Response(null, { status: 304, headers: h });
  if (obj.range && request.headers.has('range')) {
    const offset = obj.range.offset ?? (obj.size - obj.range.suffix);
    const length = obj.range.length ?? (obj.size - offset);
    h.set('content-range', `bytes ${offset}-${offset + length - 1}/${obj.size}`);
    h.set('content-length', String(length));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('content-length', String(obj.size));
  return new Response(obj.body, { headers: h });
}

// ======================= Utilitaires =======================
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}
function rid(n) {
  const a = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  let s = '';
  for (const b of bytes) s += a[b % a.length];
  return s;
}
const int = (v) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.round(Number(v)) : null);
const num = (v) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : null);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function guessType(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  return ({
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp',
    heic: 'image/heic', heif: 'image/heif', avif: 'image/avif', dng: 'image/x-adobe-dng',
    mov: 'video/quicktime', mp4: 'video/mp4', m4v: 'video/x-m4v', webm: 'video/webm', '3gp': 'video/3gpp', mkv: 'video/x-matroska',
  })[ext] || 'application/octet-stream';
}
function kindOf(type, name) {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  const g = guessType(name);
  if (g.startsWith('image/')) return 'image';
  if (g.startsWith('video/')) return 'video';
  return 'other';
}
function disposition(name, attachment = false) {
  const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '');
  return `${attachment ? 'attachment' : 'inline'}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}
async function deletePrefix(env, prefix) {
  let cursor;
  do {
    const list = await env.BUCKET.list({ prefix, cursor });
    if (list.objects.length) await env.BUCKET.delete(list.objects.map((o) => o.key));
    cursor = list.truncated ? list.cursor : undefined;
  } while (cursor);
}
async function hmacKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode('tribu:' + env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function hmac(env, msg) {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env), new TextEncoder().encode(msg));
  return b64url(sig);
}
async function sha(s) {
  return b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
}
function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([sha(a), sha(b)]);
  let r = 0;
  for (let i = 0; i < x.length; i++) r |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return r === 0;
}
async function isAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const c = (request.headers.get('cookie') || '').match(/(?:^|;\s*)tribu_admin=([^;]+)/);
  if (!c) return false;
  const [exp, sig] = c[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return (await hmac(env, `admin|${exp}`)) === sig;
}
