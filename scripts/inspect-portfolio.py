import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts'
OUT.mkdir(exist_ok=True)
BASE = os.environ.get('PORTFOLIO_URL', 'http://127.0.0.1:3200')
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    context = browser.new_context(viewport={'width':1440,'height':900}, reduced_motion='reduce')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until='networkidle')
    page.locator('img[loading="lazy"]').evaluate_all('(images) => images.forEach(img => { img.loading = "eager"; })')
    page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
    page.evaluate('async () => { await Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {}))); }')
    for name in ['project-chaintrace', 'project-botvue', 'project-grid', 'about', 'skills-grid']:
        page.locator('.'+name).scroll_into_view_if_needed()
        page.wait_for_timeout(150)
        page.locator('.'+name).screenshot(path=str(OUT / f'desktop-{name}.png'))
    page.evaluate('scrollTo({top:0,behavior:"instant"})')
    page.screenshot(path=str(OUT / 'desktop-home.png'), full_page=True)
    page.screenshot(path=str(OUT / 'desktop-hero.png'))
    for width, height in [(320,568),(375,812),(390,844),(768,1024),(1024,768),(1440,900),(1920,1080)]:
        page.set_viewport_size({'width':width,'height':height})
        page.evaluate('window.scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'hero-{width}.png'))
        overflow = page.evaluate('document.documentElement.scrollWidth > innerWidth')
        bad = page.locator('body *').evaluate_all('(els) => els.filter(e => {const r=e.getBoundingClientRect();return r.width>0 && (r.right>innerWidth+1 || r.left < -1) && getComputedStyle(e).position !== "fixed"}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className}))') if overflow else []
        print(json.dumps({'viewport':[width,height], 'overflow':overflow, 'elements':bad}), flush=True)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(OUT / 'mobile-home.png'), full_page=True)
    page.goto(BASE + '/work/chaintrace', wait_until='networkidle')
    page.screenshot(path=str(OUT / 'mobile-case-study.png'), full_page=True)
    print(json.dumps({'errors':errors}))
    browser.close()
