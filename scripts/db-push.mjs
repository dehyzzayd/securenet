// Create the SQLite tables without needing the app to run. Idempotent.
import { createClient } from '@libsql/client';
import fs from 'node:fs';

const url = process.env.DATABASE_URL || 'file:./data/securenet.db';
if (url.startsWith('file:')) fs.mkdirSync('data', { recursive: true });
const client = createClient({ url });

await client.execute(`CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  profile TEXT,
  need TEXT,
  message TEXT,
  locale TEXT DEFAULT 'fr',
  source TEXT,
  status TEXT DEFAULT 'new'
);`);
await client.execute(`CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  email TEXT,
  name TEXT,
  doc TEXT NOT NULL
);`);
console.log('✓ Tables prêtes dans', url);
process.exit(0);
