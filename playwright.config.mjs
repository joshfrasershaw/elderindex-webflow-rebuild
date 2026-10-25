import { defineConfig } from '@playwright/test';
import fs from 'node:fs';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
export default defineConfig({
  testDir:'./tests',fullyParallel:true,workers:2,timeout:30000,
  reporter:'list',use:{baseURL:'http://127.0.0.1:4185',viewport:{width:1440,height:1000},launchOptions:{executablePath,args:['--no-sandbox']}},
  webServer:{command:'node scripts/build.mjs && python3 -m http.server 4185 --bind 127.0.0.1 -d dist',url:'http://127.0.0.1:4185',reuseExistingServer:false,stdout:'ignore',stderr:'ignore',env:{...process.env,GA4_MEASUREMENT_ID:'G-TEST123',SITE_ENV:'staging',FORM_ENDPOINT:'https://formspree.io/f/xpqlvnaa'}}
});
