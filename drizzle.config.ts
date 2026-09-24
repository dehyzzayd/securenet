import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'libsql',
  dbCredentials: { url: process.env.DATABASE_URL || 'file:./data/securenet.db' },
} satisfies Config;
