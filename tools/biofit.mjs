import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1920,1080],[1440,900],[1280,800],[1024,768],[390,844]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  const r=await p.evaluate(()=>{
    const t=document.querySelector('.bio-text');
    const cs=getComputedStyle(t);
    const card=document.querySelector('.bio-card').getBoundingClientRect();
    const photo=document.querySelector('.artist-photo').getBoundingClientRect();
    const tb=t.getBoundingClientRect();
    return {px:cs.fontSize, textB:+tb.bottom.toFixed(0),
            photoT:+photo.top.toFixed(0), photoH:+photo.height.toFixed(0),
            cardB:+card.bottom.toFixed(0),
            clipped: photo.bottom > card.bottom + 1};
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
