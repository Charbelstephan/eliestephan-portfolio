import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1920,1080],[1280,800],[390,844]]) {
  const page=await browser.newPage();
  await page.setViewport({width:w,height:h});
  await page.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  const r=await page.evaluate(()=>{
    const b=(s)=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect();
      return {l:+r.left.toFixed(1),r:+r.right.toFixed(1),t:+r.top.toFixed(1),b:+r.bottom.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)};};
    const cs=getComputedStyle(document.querySelector('.brand-tagline'));
    return {brand:b('.brand'),logo:b('.brand-logo'),tag:b('.brand-tagline'),
      style:{fs:cs.fontSize,ls:cs.letterSpacing,mr:cs.marginRight,mt:cs.marginTop,ta:cs.textAlign}};
  });
  console.log(w, JSON.stringify(r));
  await page.close();
}
await browser.close();
