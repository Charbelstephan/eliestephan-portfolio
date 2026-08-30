import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const combos=[['7.96vh','4.9vh','current'],['6vh','4vh','a'],['5vh','3.5vh','b'],['4vh','3vh','c'],['3vh','2.5vh','d']];
const sizes=[[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800],[1280,720]];
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const rows={};
for (const [top,bot,name] of combos) {
  rows[`${name} (${top}/${bot})`]={};
  for (const [w,h] of sizes) {
    const p=await b.newPage(); await p.setViewport({width:w,height:h});
    await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
    await p.evaluate(()=>document.fonts.ready);
    await p.addStyleTag({content:`@media(min-width:1024px){.site-header{padding-top:${top}!important;padding-bottom:${bot}!important}}`});
    const r=await p.evaluate(()=>{
      const img=document.querySelector('.artist-photo').getBoundingClientRect();
      const col=document.querySelector('.bio-card').getBoundingClientRect();
      const logo=document.querySelector('.brand-logo').getBoundingClientRect();
      return {pct:Math.round(img.width/col.width*100), logoTop:Math.round(logo.top)};
    });
    rows[`${name} (${top}/${bot})`][`${w}x${h}`]=r.pct+'%'+(r.pct>=100?' *':'');
    await p.close();
  }
}
const header=['header padding'.padEnd(22),...sizes.map(s=>(s[0]+'x'+s[1]).padStart(10))].join('');
console.log(header);
for (const [k,v] of Object.entries(rows))
  console.log(k.padEnd(22)+sizes.map(s=>String(v[`${s[0]}x${s[1]}`]).padStart(10)).join(''));
console.log('\n* = photo reaches full column width (uncropped, bottom on the footer line)');
console.log('logo top at 1920 for each: current 86px is the mock value');
await b.close();
