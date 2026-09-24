#!/usr/bin/env bash
# Installation complète de Tribu sur ton compte Cloudflare, en une commande.
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Installation des dépendances"
npm install --silent

echo "==> Connexion à Cloudflare (une page va s'ouvrir dans ton navigateur)"
npx wrangler whoami >/dev/null 2>&1 || npx wrangler login

echo "==> Création du stockage photos (R2)"
if ! npx wrangler r2 bucket list 2>/dev/null | grep -q "tribu-photos"; then
  if ! npx wrangler r2 bucket create tribu-photos; then
    echo ""
    echo "!! Impossible de créer le stockage R2. Active R2 dans le tableau de bord Cloudflare"
    echo "   (menu R2 Object Storage), puis relance ce script."
    exit 1
  fi
fi

echo "==> Création de la base (D1)"
if grep -q "REMPLACER_PAR_L_ID_D1" wrangler.toml; then
  OUT=$(npx wrangler d1 create tribu 2>&1 || true)
  ID=$(echo "$OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  if [ -z "$ID" ]; then
    ID=$(npx wrangler d1 list --json | node -pe 'JSON.parse(require("fs").readFileSync(0)).find(d=>d.name==="tribu").uuid')
  fi
  sed -i.bak "s/REMPLACER_PAR_L_ID_D1/$ID/" wrangler.toml && rm -f wrangler.toml.bak
fi
npx wrangler d1 execute tribu --remote --file=schema.sql -y

echo "==> Choisis ton mot de passe admin"
npx wrangler secret put ADMIN_PASSWORD

echo "==> Mise en ligne"
npx wrangler deploy

echo ""
echo "C'est en ligne. Ouvre l'adresse *.workers.dev affichée ci-dessus, connecte-toi et crée ton premier album."
