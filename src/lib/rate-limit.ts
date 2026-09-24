// Tiny in-memory rate limiter (per key). Fine for a single-node deploy.
type Hit = { count: number; reset: number };
const store = new Map<string, Hit>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const hit = store.get(key);
  if (!hit || now > hit.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (hit.count >= max) return false;
  hit.count++;
  return true;
}

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'local'
  );
}
