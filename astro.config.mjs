import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// SecureNet — full-stack prestige site (Heritage Prestige design language)
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: 3040, host: true },
  site: process.env.SITE_URL || 'http://localhost:3040',
  devToolbar: { enabled: false },
});
