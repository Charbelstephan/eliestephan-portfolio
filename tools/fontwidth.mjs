import puppeteer from 'puppeteer-core';
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
await p.goto('http://localhost:4287/',{waitUntil:'networkidle0'});
await p.evaluate(()=>document.fonts.ready);
console.log(await p.evaluate(()=>{
  const line='Elie Stephan is a Beirut-based makeup artist specializing in refined';
  const probe=document.createElement('span');
  probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font-size:100px;font-weight:200';
  document.body.appendChild(probe);
  const out={};
  for (const fam of ['Futura','Jost','Century Gothic','Trebuchet MS','Arial']) {
    probe.style.fontFamily=`'${fam}'`;
    probe.textContent=line;
    const w=probe.getBoundingClientRect().width;
    // cap height probe
    probe.textContent='H';
    const capW=probe.getBoundingClientRect().width;
    out[fam]={lineAt100px:+w.toFixed(1), Hwidth:+capW.toFixed(1)};
  }
  probe.remove();
  return JSON.stringify(out,null,1);
}));
await b.close();
