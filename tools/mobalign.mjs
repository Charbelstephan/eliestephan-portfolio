import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[390,844],[375,812],[430,932]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  console.log(w+'x'+h, await p.evaluate(()=>{
    const img=document.querySelector('.artist-photo').getBoundingClientRect();
    const f=document.querySelector('.site-footer').getBoundingClientRect();
    const links=document.querySelector('.footer-links').getBoundingClientRect();
    return JSON.stringify({photoBottom:Math.round(img.bottom), footerBottom:Math.round(f.bottom),
      linksBottom:Math.round(links.bottom), photoW:Math.round(img.width),
      gap:Math.round(img.bottom-f.bottom)});
  }));
  await p.close();
}
await b.close();
