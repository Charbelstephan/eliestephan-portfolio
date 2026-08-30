import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1920,1080],[1440,900],[1280,800],[1024,768],[390,844]]) {
  const p=await b.newPage(); await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  console.log(w, await p.evaluate(()=>{
    const img=document.querySelector('.artist-photo');
    const r=img.getBoundingClientRect();
    const ar=img.naturalWidth/img.naturalHeight;
    // painted size under object-fit: contain
    const boxAR=r.width/r.height;
    const pw = boxAR>ar ? r.height*ar : r.width;
    const ph = boxAR>ar ? r.height   : r.width/ar;
    return JSON.stringify({box:[Math.round(r.width),Math.round(r.height)],
      painted:[Math.round(pw),Math.round(ph)], whole:true,
      sideGap:Math.round((r.width-pw)/2)});
  }));
  await p.close();
}
await b.close();
