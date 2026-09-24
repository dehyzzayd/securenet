import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { db, ensureSchema, schema } from '../../../lib/db';
import { isAuthed } from '../../../lib/auth';

export const prerender = false;

const cell = (v: unknown) => {
  const s = v == null ? '' : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return new Response('Non autorisé', { status: 401 });
  await ensureSchema();
  const rows = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
  const head = ['id', 'date', 'nom', 'telephone', 'email', 'profil', 'besoin', 'message', 'source', 'statut'];
  const body = rows.map((r) =>
    [r.id, r.createdAt?.toISOString?.() ?? r.createdAt, r.name, r.phone, r.email, r.profile, r.need, r.message, r.source, r.status]
      .map(cell).join(';'),
  );
  const csv = '﻿' + [head.join(';'), ...body].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="securenet-leads.csv"`,
    },
  });
};
