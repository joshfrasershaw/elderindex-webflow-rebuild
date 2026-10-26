import AxeBuilder from '@axe-core/playwright';
import {test,expect} from '@playwright/test';
import {pages} from '../src/data.mjs';
const endpoint='https://formspree.io/f/xpqlvnaa';
test.beforeEach(async({page})=>{
  await page.route(/^https:\/\/(fonts\.|images\.pexels|www\.googletagmanager|www\.google-analytics)/,route=>route.fulfill({status:200,body:'',contentType:'text/plain'}));
});
async function fillEnquiry(page){
  await page.getByLabel('Your name').fill('ElderIndex test');
  await page.getByLabel('Work email').fill('test@example.com');
  await page.getByLabel('Project details').fill('Automated test of the enquiry interface.');
}
async function allowAnalytics(page){await page.getByRole('button',{name:'Allow analytics',exact:true}).click();}
async function eventNames(page){return page.evaluate(()=>Array.from(window.dataLayer||[]).filter(a=>a[0]==='event').map(a=>a[1]));}
test('forms validate inline, preserve data on failure and allow a confirmed retry',async({page})=>{
  let requests=0;
  await page.route(endpoint,route=>{requests++;return route.fulfill({status:requests===1?422:200,contentType:'application/json',body:requests===1?'{"errors":[{"message":"Test failure"}]}':'{"ok":true}'});});
  await page.goto('/talk-to-us/');
  await page.getByRole('button',{name:'Send enquiry'}).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(3);
  await expect(page.getByLabel('Your name')).toBeFocused();expect(requests).toBe(0);
  await fillEnquiry(page);await page.getByLabel('Existing website').fill('example.com');
  await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByLabel('Existing website')).toHaveAttribute('aria-invalid','true');expect(requests).toBe(0);
  await page.getByLabel('Existing website').fill('https://example.com');await page.getByLabel('SEO & visibility',{exact:true}).check();
  await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByRole('status')).toContainText('could not be confirmed');
  await expect(page.getByLabel('Your name')).toHaveValue('ElderIndex test');
  await expect(page.getByLabel('SEO & visibility',{exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByRole('status')).toContainText('your enquiry has been received');
  expect(requests).toBe(2);await expect(page.getByLabel('Your name')).toHaveValue('');
  await expect(page.getByRole('button',{name:'Enquiry received'})).toBeDisabled();
  expect(await eventNames(page)).not.toContain('generate_lead');
});
test('confirmed POST includes multiple services, blocks duplicates and tracks a consented lead without PII',async({page})=>{
  let requests=0,payload='';
  await page.route(endpoint,async route=>{requests++;payload=route.request().postData();await new Promise(r=>setTimeout(r,300));await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
  await page.goto('/talk-to-us/');await allowAnalytics(page);await fillEnquiry(page);
  await page.getByLabel('Organisation',{exact:true}).fill('Test Care');await page.getByLabel('Existing website').fill('https://example.com');
  await page.getByLabel('New website or redesign',{exact:true}).check();await page.getByLabel('SEO & visibility',{exact:true}).check();
  await page.getByRole('button',{name:'Send enquiry'}).click();
  await page.locator('form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.getByRole('status')).toContainText('has been received');expect(requests).toBe(1);
  for(const value of ['Test Care','https://example.com','New website or redesign','SEO & visibility'])expect(payload).toContain(value);
  expect(await eventNames(page)).toContain('generate_lead');
  const analytics=await page.evaluate(()=>JSON.stringify(window.dataLayer));
  for(const personal of ['test@example.com','Test Care','Automated test of the enquiry'])expect(analytics).not.toContain(personal);
});
test('an unconfirmed 2xx response is not reported as a success',async({page})=>{
  await page.route(endpoint,route=>route.fulfill({status:200,contentType:'text/html',body:'Unexpected login page'}));
  await page.goto('/talk-to-us/');await fillEnquiry(page);await page.getByRole('button',{name:'Send enquiry'}).click();
  await expect(page.getByRole('status')).toContainText('could not be confirmed');await expect(page.getByLabel('Your name')).toHaveValue('ElderIndex test');
});
test('network failure preserves enquiry and exposes an actionable error',async({page})=>{
  await page.route(endpoint,route=>route.abort('failed'));await page.goto('/talk-to-us/');await fillEnquiry(page);
  await page.getByRole('button',{name:'Send enquiry'}).click();await expect(page.getByRole('status')).toContainText('email hello@elderindex.co.uk');
  await expect(page.getByRole('button',{name:'Send enquiry'})).toBeEnabled();await expect(page.getByLabel('Project details')).not.toHaveValue('');
});
test('a timed-out submission keeps the message and never records a lead',async({page})=>{
  await page.clock.install();
  await page.route(endpoint,()=>{});
  await page.goto('/talk-to-us/');await allowAnalytics(page);await fillEnquiry(page);
  await page.getByRole('button',{name:'Send enquiry'}).click();
  await expect(page.getByRole('status')).toContainText('Sending your enquiry');
  await page.clock.fastForward(21000);
  await expect(page.getByRole('status')).toContainText('couldn’t confirm your enquiry in time');
  await expect(page.getByLabel('Project details')).not.toHaveValue('');
  expect(await eventNames(page)).not.toContain('generate_lead');
});
test('analytics waits for consent, persists rejection, records contact clicks separately and can be revoked',async({page})=>{
  let analyticsRequests=0;page.on('request',r=>{if(r.url().includes('googletagmanager.com'))analyticsRequests++;});
  await page.goto('/talk-to-us/?email=must-not-track@example.com');expect(analyticsRequests).toBe(0);
  await page.getByRole('button',{name:'Reject analytics',exact:true}).click();await page.reload();
  await expect(page.locator('.consent-banner')).toBeHidden();expect(analyticsRequests).toBe(0);
  await page.getByRole('button',{name:'Analytics preferences'}).click();await allowAnalytics(page);
  await expect.poll(()=>analyticsRequests).toBe(1);
  await page.evaluate(()=>{document.addEventListener('click',e=>{if(e.target.closest('a[href^="mailto:"],a[href^="tel:"]'))e.preventDefault()});document.querySelector('a[href^="mailto:"]').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));const phone=document.createElement('a');phone.href='tel:000000000';document.body.append(phone);phone.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));phone.remove();});
  expect(await eventNames(page)).toEqual(expect.arrayContaining(['email_click','phone_click']));
  expect(await page.evaluate(()=>JSON.stringify(window.dataLayer))).not.toContain('must-not-track');
  await page.evaluate(()=>{document.cookie='_ga=testing; path=/';});
  await page.getByRole('button',{name:'Analytics preferences'}).click();await page.getByRole('button',{name:'Reject analytics',exact:true}).click();
  expect(await page.evaluate(()=>window['ga-disable-G-TEST123'])).toBe(true);expect(await page.evaluate(()=>document.cookie)).not.toContain('_ga=');
});
test('homepage is compact, contact qualifies, guides use contextual next steps and genuine author metadata',async({page})=>{
  await page.goto('/');await expect(page.locator('form input:not([type="checkbox"]), form textarea')).toHaveCount(4);await expect(page.getByRole('checkbox')).toHaveCount(0);
  await page.goto('/talk-to-us/');await expect(page.getByRole('checkbox')).toHaveCount(5);
  await page.goto('/guides/care-directory-comparison/');await expect(page.locator('table tbody tr')).toHaveCount(4);await expect(page.locator('form')).toHaveCount(0);await expect(page.locator('.article-byline')).toContainText('Josh');await expect(page.locator('.guide-next-step a').first()).toHaveAttribute('href','/services/care-directory-management/');
  await expect(page.getByRole('link',{name:'Google Business Profile checklist'})).toHaveCount(0);
});
test('navigation supports hover, focus, Escape and mobile taps',async({page})=>{
  await page.goto('/');const menu=page.locator('#services-submenu'),trigger=page.locator('.services-toggle');
  await trigger.hover();await expect(menu).toBeVisible();await menu.getByRole('link',{name:'Website design',exact:true}).hover();await expect(menu).toBeVisible();
  await trigger.focus();await page.keyboard.press('Escape');await expect(menu).toBeHidden();await page.keyboard.press('Enter');await expect(menu).toBeVisible();await page.keyboard.press('Tab');await expect(menu.getByRole('link',{name:'All services',exact:true})).toBeFocused();
  await page.setViewportSize({width:390,height:844});await page.locator('.menu-button').click();await page.locator('.mobile-services summary').click();await expect(page.locator('.mobile-services a').last()).toBeVisible();
});
test('crawl every page at desktop and mobile widths without JS exceptions or missing local resources',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4185')&&r.status()>=400)errors.push(r.url()+': '+r.status());});
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(const p of pages){
      await page.goto(p.path);await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${p.path} overflow at ${width}`).toBe(true);
      for(const input of await page.locator('form input,form textarea').all())expect(await input.evaluate(e=>Boolean(e.labels?.length)),p.path+' field label').toBe(true);
      const tables=page.locator('.table-scroll');for(const table of await tables.all())expect(await table.evaluate(e=>e.clientWidth<=document.documentElement.clientWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test('representative pages pass automated WCAG A/AA accessibility checks',async({page})=>{
  for(const path of ['/', '/talk-to-us/', '/services/home-care/', '/guides/care-directory-comparison/']){
    await page.goto(path);await page.evaluate(()=>document.fonts.ready);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),path).toEqual([]);
  }
});
