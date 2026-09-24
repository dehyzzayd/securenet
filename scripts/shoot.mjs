// Full-page mobile/desktop screenshots via system Chrome (QA only).
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'http://localhost:3040/';
const out = process.argv[3] || '/tmp/shot.png';
const w = +(process.argv[4] || 390);
const h = +(process.argv[5] || 844);
const full = process.argv[6] !== 'view';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 900, hasTouch: w < 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
// let fonts + reveals settle
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: out, fullPage: full });
const dims = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: window.innerWidth, sh: document.documentElement.scrollHeight }));
console.log(JSON.stringify(dims));
await browser.close();
