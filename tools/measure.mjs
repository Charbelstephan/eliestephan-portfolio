import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.argv[2] ?? 'http://localhost:4287/';
const width = Number(process.argv[3] ?? 390);
const height = Number(process.argv[4] ?? 844);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0' });

const report = await page.evaluate(() => {
  const doc = document.documentElement;
  const out = {
    viewport: window.innerWidth,
    scrollWidth: doc.scrollWidth,
    offenders: [],
    header: null,
    icons: null,
  };
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 0.5 && r.width > 0) {
      out.offenders.push({
        sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : ''),
        left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
      });
    }
  }
  const h = document.querySelector('.site-header');
  const i = document.querySelector('.header-icons');
  const box = (e) => { const r = e.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), top: Math.round(r.top) }; };
  if (h) out.header = box(h);
  if (i) out.icons = box(i);
  return out;
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
