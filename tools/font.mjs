import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
p.on('requestfailed',r=>console.log('FAILED',r.url()));
p.on('response',r=>{const u=r.url(); if(/fonts\.css|\.woff|\.otf|\.ttf/i.test(u)) console.log(r.status(),u);});
await p.setViewport({width:1920,height:1080});
await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
console.log(await p.evaluate(async()=>{
  await document.fonts.ready;
  const el=document.querySelector('.brand-tagline');
  const cs=getComputedStyle(el);
  return JSON.stringify({
    familyCSS: cs.fontFamily,
    futuraLoaded: document.fonts.check('13px Futura'),
    loaded: [...document.fonts].map(f=>f.family+':'+f.status),
    taglineWidth: el.getBoundingClientRect().width,
  },null,1);
}));
await b.close();
