import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// On Vercel (serverless) the working dir is read-only — only /tmp is writable.
// For persistent leads in production, set DATABASE_URL to a hosted libSQL (Turso).
const defaultUrl = process.env.VERCEL ? 'file:/tmp/securenet.db' : 'file:./data/securenet.db';
const url = process.env.DATABASE_URL || defaultUrl;
const client = createClient({ url });

export const db = drizzle(client, { schema });
export { schema };

// Ensure tables exist (idempotent) — keeps dev frictionless without a migration step.
let ready: Promise<void> | null = null;
export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
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
    })();
  }
  return ready;
}
