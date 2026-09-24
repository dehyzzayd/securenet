import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, ensureSchema, schema } from '../../lib/db';
import { rateLimit, clientIp } from '../../lib/rate-limit';

export const prerender = false;

const Body = z.object({
  name: z.string().max(120).optional().or(z.literal('')),
  email: z.string().email('E-mail invalide').max(160),
  company_website: z.string().optional(), // honeypot
});

const DOC = '/docs/dossier-securenet.pdf';
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!rateLimit(`dl:${clientIp(request)}`, 10, 10 * 60 * 1000))
      return json({ error: 'Trop de demandes. Réessayez plus tard.' }, 429);

    const raw = await request.json().catch(() => null);
    const parsed = Body.safeParse(raw);
    if (!parsed.success) return json({ error: parsed.error.issues[0]?.message || 'E-mail invalide.' }, 400);
    const d = parsed.data;
    if (d.company_website) return json({ url: DOC }); // bot

    await ensureSchema();
    await db.insert(schema.downloads).values({ email: d.email, name: d.name || null, doc: DOC });

    return json({ ok: true, url: DOC });
  } catch (e) {
    console.error('[api/download]', e);
    return json({ error: 'Erreur serveur.' }, 500);
  }
};
