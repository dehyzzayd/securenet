import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async () =>
  new Response(null, { status: 302, headers: { Location: '/admin/login', 'Set-Cookie': clearCookie() } });

export const GET: APIRoute = async () =>
  new Response(null, { status: 302, headers: { Location: '/admin/login', 'Set-Cookie': clearCookie() } });
