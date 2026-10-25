import fs from 'node:fs';
import {chromium} from '@playwright/test';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
const serif=fs.readFileSync(new URL('../public/assets/fonts/dm-serif-display.woff2',import.meta.url)).toString('base64');
const sans=fs.readFileSync(new URL('../public/assets/fonts/dm-sans.woff2',import.meta.url)).toString('base64');
let html=fs.readFileSync(new URL('./social-card.html',import.meta.url),'utf8');
html=html.replace('<style>',`<style>@font-face{font-family:SocialSerif;src:url(data:font/woff2;base64,${serif})}@font-face{font-family:SocialSans;src:url(data:font/woff2;base64,${sans})}`);
html=html.replaceAll('Georgia,serif','SocialSerif,Georgia,serif').replaceAll('Arial,sans-serif','SocialSans,Arial,sans-serif');
const browser=await chromium.launch({executablePath,args:['--no-sandbox']});
try{
  const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:new URL('../public/assets/elderindex-social.png',import.meta.url).pathname});
}finally{await browser.close();}
console.log('Rendered 1200 × 630 social image with locally hosted brand fonts.');
