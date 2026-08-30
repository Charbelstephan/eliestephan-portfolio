import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const [w,h] of [[1920,1080],[1280,800],[390,844]]) {
  const p=await b.newPage();
  await p.setViewport({width:w,height:h});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  const r=await p.evaluate(()=>{
    const logo=document.querySelector('.brand-logo').getBoundingClientRect();
    const el=document.querySelector('.brand-tagline');
    // ink width of the text itself, via a Range over the text node
    const range=document.createRange(); range.selectNodeContents(el);
    const t=range.getBoundingClientRect();
    const ls=parseFloat(getComputedStyle(el).letterSpacing);
    const logoW=logo.width;
    const inset=logoW*0.01675;          // padding after the N inside brand.svg
    return {
      logoL:+logo.left.toFixed(1), logoR:+logo.right.toFixed(1), logoW:+logoW.toFixed(1),
      nRight:+(logo.right-inset).toFixed(1),
      textL:+t.left.toFixed(1), textR:+t.right.toFixed(1),
      inkR:+(t.right-ls).toFixed(1),   // last glyph edge = box right minus trailing track
      inkW:+(t.width-ls).toFixed(1),
      pctOfMark:+(((t.width-ls)/logoW)*100).toFixed(1),
    };
  });
  const err=(r.inkR-r.nRight).toFixed(1);
  console.log(w, JSON.stringify(r), '=> flush error', err, 'px');
  await p.close();
}
await b.close();
