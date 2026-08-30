import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1366,768],[1536,864],[1920,1080],[1280,720]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  console.log(w+'x'+h, await p.evaluate(()=>{
    const img=document.querySelector('.artist-photo').getBoundingClientRect();
    const card=document.querySelector('.bio-card').getBoundingClientRect();
    return JSON.stringify({photoBottom:Math.round(img.bottom), cardBottom:Math.round(card.bottom),
      clippedBy: Math.max(0, Math.round(img.bottom-card.bottom))});
  }));
  await p.close();
}
await b.close();
