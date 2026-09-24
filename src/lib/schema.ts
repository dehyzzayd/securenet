import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email').notNull(),
  profile: text('profile'),   // "Vous êtes"
  need: text('need'),         // "Votre besoin"
  message: text('message'),
  locale: text('locale').default('fr'),
  source: text('source'),
  status: text('status').default('new'), // new | contacted | qualified | won | lost
});

export const downloads = sqliteTable('downloads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  email: text('email'),
  name: text('name'),
  doc: text('doc').notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type Download = typeof downloads.$inferSelect;
