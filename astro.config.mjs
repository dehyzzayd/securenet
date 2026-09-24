import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// SecureNet — full-stack prestige site (Heritage Prestige design language).
// Uses the Vercel adapter when building on Vercel, and the Node standalone
// adapter for local `npm run preview`. `astro dev` works with either.
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  output: 'server',
  adapter: onVercel ? vercel() : node({ mode: 'standalone' }),
  server: { port: 3040, host: true },
  site: process.env.SITE_URL || 'http://localhost:3040',
  devToolbar: { enabled: false },
});
