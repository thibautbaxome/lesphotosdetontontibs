CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  uploads_open INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  kind TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploader TEXT,
  owner_hash TEXT,
  upload_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  has_thumb INTEGER NOT NULL DEFAULT 0,
  has_preview INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  duration REAL,
  taken_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS media_album ON media(album_id, status, created_at);
