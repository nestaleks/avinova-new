#!/usr/bin/env node
/* AVINOVA redesigns — automated browser QA (Playwright, Chromium)

   Prerequisites
     1. Preview server running:  node redesigns/tools/serve.mjs 8090
     2. Playwright available, e.g. outside the project:
          mkdir %TEMP%\av-qa && cd %TEMP%\av-qa && npm i playwright && npx playwright install chromium
        then point PLAYWRIGHT_PATH at it:  set PLAYWRIGHT_PATH=%TEMP%\av-qa\node_modules\playwright

   Run
     node redesigns/qa/run-qa.cjs [baseUrl] [--shots] [--only=e,f,g,h]
     baseUrl defaults to http://localhost:8090 ; --shots also saves screenshots to qa/screenshots/

   Output: qa/results.json + a summary on stdout. Exit code 1 if any check failed. */
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const BASE = (process.argv.slice(2).find(a => a.startsWith('http')) || 'http://localhost:8090').replace(/\/$/, '');
const SHOTS = process.argv.includes('--shots');
const OUT = __dirname;
const ALL_CONCEPTS = ['concept-a-refined', 'concept-b-premium', 'concept-c-interactive', 'concept-d-creative',
  'concept-e-grid', 'concept-f-noir', 'concept-g-bento', 'concept-h-editorial'];
// --only=e,f,g,h limits the run to some concepts (matched by letter)
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const CONCEPTS = ONLY.length ? ALL_CONCEPTS.filter(c => ONLY.includes(c.split('-')[1])) : ALL_CONCEPTS;
const PAGES = ['index.html', 'case-studies.html', 'impressum.html', 'datenschutz.html', 'agb.html'];
const VIEWPORTS = [[1920, 1080], [1440, 900], [1024, 768], [768, 1024], [390, 844], [360, 800]];

const results = [];
function record(scope, check, ok, detail) { results.push({ scope, check, ok, detail: detail === undefined ? '' : detail }); }

async function scrollThrough(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';   // base.css enables smooth scrolling → steps would not move
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += Math.round(window.innerHeight * 0.6)) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
    window.scrollTo(0, h()); await new Promise(r => setTimeout(r, 300));
  });
  await page.waitForTimeout(900);
}

function watch(page) {
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) errs.push('failed: ' + r.url()); });
  page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ': ' + r.url()); });
  return errs;
}

async function pageChecks(browser, concept, file, [w, h], opts = {}) {
  const scope = `${concept}/${file} @${w}x${h}${opts.reduced ? ' reduced-motion' : ''}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: opts.reduced ? 'reduce' : 'no-preference', hasTouch: w < 1024, isMobile: false });
  const page = await ctx.newPage();
  const errs = watch(page);
  const url = `${BASE}/redesigns/${concept}/${file}`;
  const resp = await page.goto(url, { waitUntil: 'networkidle' });
  record(scope, 'HTTP 200', resp && resp.status() === 200, resp && resp.status());
  if (file !== 'index.html' && file !== 'case-studies.html') {
    await page.waitForFunction(() => document.querySelectorAll('[data-legal="body"] section').length > 0, null, { timeout: 5000 }).catch(() => {});
  }
  await scrollThrough(page);

  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const overflow = document.documentElement.scrollWidth - vw;
    const broken = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src'));
    const noAlt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src'));
    const h1 = document.querySelectorAll('h1').length;
    const hidden = [...document.querySelectorAll('[data-reveal], .reveal')].filter(el => !el.classList.contains('is-in') && el.offsetParent !== null && getComputedStyle(el).opacity === '0').length;
    // elements sticking out of the viewport horizontally (ignores anything inside a clipping ancestor)
    const offenders = [];
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= vw + 1) continue;
      let clipped = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (ox !== 'visible') { clipped = true; break; }
      }
      if (!clipped && getComputedStyle(el).position !== 'fixed') offenders.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''));
      if (offenders.length > 4) break;
    }
    const legal = document.querySelectorAll('[data-legal="body"] section').length;
    const emptyLinks = [...document.querySelectorAll('a')].filter(a => !a.getAttribute('href')).length;
    const unnamedButtons = [...document.querySelectorAll('button')].filter(b => !(b.textContent.trim() || b.getAttribute('aria-label') || b.getAttribute('aria-labelledby') || b.title)).length;
    return { overflow, broken, noAlt, h1, hidden, offenders, legal, emptyLinks, unnamedButtons };
  });
  record(scope, 'no horizontal overflow', info.overflow <= 0, info.overflow > 0 ? `${info.overflow}px; ${info.offenders.join(', ')}` : '');
  record(scope, 'no broken images', info.broken.length === 0, info.broken.join(', '));
  record(scope, 'all <img> have alt', info.noAlt.length === 0, info.noAlt.join(', '));
  record(scope, 'exactly one h1', info.h1 === 1, info.h1);
  record(scope, 'no reveal element left invisible', info.hidden === 0, info.hidden);
  record(scope, 'no <a> without href', info.emptyLinks === 0, info.emptyLinks);
  record(scope, 'all buttons have a name', info.unnamedButtons === 0, info.unnamedButtons);
  if (!['index.html', 'case-studies.html'].includes(file)) record(scope, 'legal text loaded', info.legal > 0, info.legal + ' sections');

  if (SHOTS && !opts.reduced && (w === 1440 || w === 390) && ['index.html', 'case-studies.html', 'impressum.html'].includes(file)) {
    const dir = path.join(OUT, 'screenshots'); fs.mkdirSync(dir, { recursive: true });
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, `${concept}--${file.replace('.html', '')}--${w}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
  }

  // ---- interactive checks ----
  if (file === 'index.html' && w === 390 && !opts.reduced) await mobileMenu(page, scope);
  if (file === 'index.html' && w === 1440 && !opts.reduced) await formCheck(page, scope);
  record(scope, 'no console errors / failed requests', errs.length === 0, errs.slice(0, 5).join(' | '));
  await ctx.close();
}

async function mobileMenu(page, scope) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const toggle = page.locator('header button[aria-controls][aria-expanded]').first();
  if (!(await toggle.count())) { record(scope, 'mobile menu toggle exists', false, 'no header button[aria-controls][aria-expanded]'); return; }
  const visible = await toggle.isVisible();
  record(scope, 'mobile menu toggle visible', visible);
  if (!visible) return;
  const box = await toggle.boundingBox();
  record(scope, 'menu toggle ≥ 44×44', box && box.width >= 43.5 && box.height >= 43.5, box && `${Math.round(box.width)}×${Math.round(box.height)}`);
  await toggle.click(); await page.waitForTimeout(500);
  const panelId = await toggle.getAttribute('aria-controls');
  const opened = (await toggle.getAttribute('aria-expanded')) === 'true' && await page.locator('#' + panelId).isVisible();
  record(scope, 'mobile menu opens', opened);
  const links = await page.locator('#' + panelId + ' a:visible').count();
  record(scope, 'mobile menu shows links', links >= 5, links);
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  record(scope, 'Escape closes menu', (await toggle.getAttribute('aria-expanded')) === 'false');
  const focusBack = await page.evaluate(id => document.activeElement && document.activeElement.getAttribute('aria-controls') === id, panelId);
  record(scope, 'focus returns to toggle', focusBack);
}

async function formCheck(page, scope) {
  const form = page.locator('form:has([data-form-status])').first();
  if (!(await form.count())) { record(scope, 'contact form present', false); return; }
  await form.scrollIntoViewIfNeeded();
  await form.locator('[type=submit]').click(); await page.waitForTimeout(300);
  const invalid = await form.locator('[aria-invalid=true]').count();
  const errText = await form.locator('[data-form-status]').textContent();
  record(scope, 'empty submit flags 4 invalid fields', invalid === 4, invalid);
  record(scope, 'empty submit shows error status', /prüfe/.test(errText || ''), errText);
  await form.locator('[name=name]').fill('Max Mustermann');
  await form.locator('[name=email]').fill('max@example.de');
  await form.locator('[name=message]').fill('Wir möchten mehr qualifizierte Anfragen.');
  await form.locator('[name=consent]').check({ force: true });
  await form.locator('[type=submit]').click(); await page.waitForTimeout(1600);
  const okText = await page.locator('[data-form-status]').first().textContent();
  record(scope, 'valid submit: honest "not sent" status', /nicht versendet/.test(okText || ''), (okText || '').slice(0, 60));
  record(scope, 'valid submit clears invalid state', (await form.locator('[aria-invalid=true]').count()) === 0);
}

(async () => {
  const browser = await chromium.launch();
  // the original site must still render without errors
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); const errs = watch(p);
    for (const f of PAGES) { const r = await p.goto(`${BASE}/${f}`, { waitUntil: 'networkidle' }); record(`original/${f}`, 'renders (HTTP 200, no errors)', r.status() === 200 && errs.length === 0, errs.join(' | ')); }
    await ctx.close();
  }
  { // selector page
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); const errs = watch(p);
    await p.goto(`${BASE}/redesigns/`, { waitUntil: 'networkidle' });
    const hrefs = await p.$$eval('a[href*="concept-"]', as => [...new Set(as.map(a => a.getAttribute('href')))]);
    record('redesigns/index.html', `links to ${ALL_CONCEPTS.length} concepts`, ALL_CONCEPTS.every(c => hrefs.some(h => h.includes(c))), hrefs.join(', '));
    record('redesigns/index.html', 'no console errors', errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  for (const c of CONCEPTS) {
    for (const f of PAGES) {
      for (const vp of VIEWPORTS) await pageChecks(browser, c, f, vp);
    }
    await pageChecks(browser, c, 'index.html', [1440, 900], { reduced: true });
    await pageChecks(browser, c, 'case-studies.html', [390, 844], { reduced: true });
  }
  await browser.close();

  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  const failed = results.filter(r => !r.ok);
  console.log(`checks: ${results.length}, passed: ${results.length - failed.length}, failed: ${failed.length}`);
  failed.forEach(r => console.log(`FAIL  ${r.scope} — ${r.check}${r.detail !== '' ? ' — ' + r.detail : ''}`));
  process.exitCode = failed.length ? 1 : 0;
})();
