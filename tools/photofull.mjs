import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1366,768],[1280,720],[1536,864]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  console.log(w+'x'+h, await p.evaluate(()=>{
    const img=document.querySelector('.artist-photo');
    const r=img.getBoundingClientRect();
    const nat=img.naturalWidth/img.naturalHeight, box=r.width/r.height;
    const col=img.parentElement.getBoundingClientRect();
    return JSON.stringify({
      photo:[Math.round(r.width),Math.round(r.height)],
      colW:Math.round(col.width),
      fullWidth: Math.abs(r.width-col.width)<1.5,
      uncropped: Math.abs(box-nat)<0.005,
      bottom:Math.round(r.bottom), viewportH:window.innerHeight,
      pageOverflow: document.documentElement.scrollHeight-window.innerHeight,
    });
  }));
  await p.close();
}
await b.close();
