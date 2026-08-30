import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
for (const c of ['#868a8d','#8f9194','#999b9e','#a3a5a8']) {
  const p=await b.newPage();
  await p.setViewport({width:1920,height:1080});
  await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  await p.addStyleTag({content:`.bio-text{color:${c}!important}`});
  await p.screenshot({path:`${process.argv[2]}/body-${c.slice(1)}.jpg`,type:'jpeg',quality:85});
  await p.close();
}
console.log('done');
await b.close();
