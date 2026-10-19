// Optional: run against a production build with Playwright installed separately.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.PORTFOLIO_TEST_URL||'http://localhost:3000';
const browser=await chromium.launch();
await fs.mkdir('qa',{recursive:true});
try{
 for(const [width,height] of [[1440,900],[768,1024],[390,844],[360,800]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  for(const id of ['hero','about','skills','work','experience','contact']){
   await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(450);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}px overflow at ${id}`);
  }
  assert.equal(await page.locator('.portfolio-project').count(),5);
  assert.equal(await page.locator('.project-actions a').count(),10);
  for(const a of await page.locator('.project-actions a').all()){assert.equal(await a.getAttribute('target'),'_blank');assert((await a.getAttribute('rel')).includes('noopener'));}
  await page.locator('#hero').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
  assert.equal(await page.locator('.work-sprite').count(),1);
  const toggle=page.getByRole('button',{name:'Toggle dark mode',exact:true});
  await toggle.click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.screenshot({path:`qa/dark-${width}.png`});
  await page.getByRole('button',{name:'Toggle dark mode',exact:true}).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await page.getByRole('button',{name:'Pause laptop animation',exact:true}).click();
  assert.equal(await page.locator('.work-sprite').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
  await page.screenshot({path:`qa/hero-${width}.png`});
  await page.locator('#work').scrollIntoViewIfNeeded();await page.screenshot({path:`qa/work-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Databases',exact:true}).click();assert((await page.locator('.element.dim').count())>0);
  const id=page.locator('.id-card');await id.focus();await page.keyboard.press('Enter');assert.equal(await id.getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[],`${width}px runtime errors`);await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(base,{waitUntil:'networkidle'});await reduced.waitForTimeout(900);assert.equal(await reduced.locator('.work-sprite').evaluate(e=>getComputedStyle(e).animationName),'none');await reduced.close();
 console.log('Browser interactions passed. Review screenshots and a complete animation loop.');
}finally{await browser.close();}
