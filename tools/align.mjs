import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800],[1280,720],[1024,768]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  console.log(w+'x'+h, await p.evaluate(()=>{
    const img=document.querySelector('.artist-photo');
    const r=img.getBoundingClientRect();
    const icons=document.querySelector('.footer-icons').getBoundingClientRect();
    const col=document.querySelector('.bio-card').getBoundingClientRect();
    const nat=img.naturalWidth/img.naturalHeight;
    return JSON.stringify({
      photoBottom:Math.round(r.bottom), iconsBottom:Math.round(icons.bottom),
      iconsMid:Math.round((icons.top+icons.bottom)/2),
      offsetFromIconsMid:Math.round(r.bottom-(icons.top+icons.bottom)/2),
      widthPct:Math.round(r.width/col.width*100),
      uncropped: Math.abs(r.width/r.height-nat)<0.006,
    });
  }));
  await p.close();
}
await b.close();
