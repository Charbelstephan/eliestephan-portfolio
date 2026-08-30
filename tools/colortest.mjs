import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.setViewport({width:1920,height:1080});
await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
await p.evaluate(()=>document.fonts.ready);
// paint every text element in the mark's grey, then re-shoot
await p.addStyleTag({content:`
 .brand-tagline{color:#808285!important}
 .bio-text,.bio-text strong{color:#808285!important}
 .bio-rule{color:#808285!important}
 .footer-links a{color:#808285!important}
`});
await p.screenshot({path:process.argv[2],type:'jpeg',quality:85});
console.log('wrote',process.argv[2]);
await b.close();
