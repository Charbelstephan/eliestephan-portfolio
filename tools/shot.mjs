import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [url, out, w, h, full] = process.argv.slice(2);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h) });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: out, fullPage: full === 'full' });
console.log('wrote', out);
await browser.close();
