import type { APIRoute } from 'astro';
import { checkPassword, makeToken, cookieHeader } from '../../../lib/auth';
import { rateLimit, clientIp } from '../../../lib/rate-limit';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!rateLimit(`login:${clientIp(request)}`, 8, 10 * 60 * 1000))
    return new Response(null, { status: 302, headers: { Location: '/admin/login?error=rate' } });

  const form = await request.formData().catch(() => null);
  const password = String(form?.get('password') || '');
  if (!checkPassword(password))
    return new Response(null, { status: 302, headers: { Location: '/admin/login?error=1' } });

  return new Response(null, {
    status: 302,
    headers: { Location: '/admin', 'Set-Cookie': cookieHeader(makeToken()) },
  });
};
