import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const w = +(process.argv[2] || 390);
const tag = process.argv[3] || 'm';
const sels = ['.hero', '.pos', '.figures', '.deck-sec', '.products', '.story', '.zones', '.partners', '.reveal', '.pillar', '.download', '.contact', '.site-footer'];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell', args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1, isMobile: w < 900, hasTouch: w < 900 });
await page.goto('http://localhost:3040/?static', { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
// pre-scroll through the whole page to trigger lazy-loaded images, then back to top
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 1400));
for (const sel of sels) {
  const el = await page.$(sel);
  if (!el) { console.log('skip', sel); continue; }
  const name = sel.replace(/[^a-z]/gi, '') || 'x';
  try { await el.screenshot({ path: `/tmp/${tag}-${name}.png` }); console.log('shot', name); }
  catch (e) { console.log('fail', name, e.message.slice(0, 40)); }
}
await browser.close();
