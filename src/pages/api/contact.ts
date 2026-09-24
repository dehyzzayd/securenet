import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db, ensureSchema, schema } from '../../lib/db';
import { rateLimit, clientIp } from '../../lib/rate-limit';
import { notifyTeam, autoReply } from '../../lib/mail';

export const prerender = false;

const Body = z.object({
  name: z.string().min(2, 'Nom trop court').max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  email: z.string().email('E-mail invalide').max(160),
  profile: z.string().max(80).optional().or(z.literal('')),
  need: z.string().max(80).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
  source: z.string().max(200).optional().or(z.literal('')),
  company_website: z.string().optional(), // honeypot
});

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  try {
    // Origin check (CSRF hardening)
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host && !origin.includes(host)) return json({ ok: false, error: 'Origine invalide.' }, 403);

    if (!rateLimit(`contact:${clientIp(request)}`, 5, 10 * 60 * 1000))
      return json({ ok: false, error: 'Trop de demandes. Réessayez dans quelques minutes.' }, 429);

    const raw = await request.json().catch(() => null);
    if (!raw) return json({ ok: false, error: 'Requête invalide.' }, 400);

    const parsed = Body.safeParse(raw);
    if (!parsed.success) return json({ ok: false, error: parsed.error.issues[0]?.message || 'Champs invalides.' }, 400);

    const d = parsed.data;
    if (d.company_website) return json({ ok: true }); // silently drop bots

    await ensureSchema();
    await db.insert(schema.leads).values({
      name: d.name, phone: d.phone || null, email: d.email,
      profile: d.profile || null, need: d.need || null,
      message: d.message || null, source: d.source || null, locale: 'fr',
    });

    // Fire emails (non-blocking failures shouldn't break the response)
    await Promise.allSettled([notifyTeam(d), autoReply(d)]);

    return json({ ok: true });
  } catch (e) {
    console.error('[api/contact]', e);
    return json({ ok: false, error: 'Erreur serveur. Réessayez ou appelez-nous.' }, 500);
  }
};

// Progressive enhancement: allow a plain form POST → redirect
export const GET: APIRoute = () => new Response(null, { status: 302, headers: { Location: '/#contact' } });
