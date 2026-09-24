import crypto from 'node:crypto';

const SECRET = process.env.SESSION_SECRET || 'dev-insecure-secret-change-me';
const PASSWORD = process.env.ADMIN_PASSWORD || 'securenet-admin';
export const COOKIE = 'sn_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function checkPassword(input: string): boolean {
  const a = Buffer.from(crypto.createHash('sha256').update(input || '').digest('hex'));
  const b = Buffer.from(crypto.createHash('sha256').update(PASSWORD).digest('hex'));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sign(value: string): string {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function makeToken(): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [role, exp, sig] = parts;
  const payload = `${role}.${exp}`;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  return role === 'admin' && Number(exp) > Date.now();
}

export function cookieHeader(token: string): string {
  const secure = (process.env.SITE_URL || '').startsWith('https') ? ' Secure;' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${MAX_AGE}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function readCookie(request: Request, name: string): string | null {
  const raw = request.headers.get('cookie') || '';
  const m = raw.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function isAuthed(request: Request): boolean {
  return verifyToken(readCookie(request, COOKIE));
}
