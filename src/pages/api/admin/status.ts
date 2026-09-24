import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db, ensureSchema, schema } from '../../../lib/db';
import { isAuthed } from '../../../lib/auth';

export const prerender = false;

const ALLOWED = ['new', 'contacted', 'qualified', 'won', 'lost'];

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
  const form = await request.formData().catch(() => null);
  const id = Number(form?.get('id'));
  const status = String(form?.get('status') || '');
  if (!id || !ALLOWED.includes(status)) return new Response(null, { status: 302, headers: { Location: '/admin' } });
  await ensureSchema();
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
  return new Response(null, { status: 302, headers: { Location: '/admin#lead-' + id } });
};
