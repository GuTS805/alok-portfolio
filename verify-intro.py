"""Verify the Mahoraga entrance against a running production server."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('PORTFOLIO_URL', 'http://127.0.0.1:3200')
OUT = Path(__file__).parent / 'artifacts'
OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until='domcontentloaded')
    intro = page.locator('.domain-intro')
    expect(intro).to_be_visible()
    bounds = intro.bounding_box()
    assert bounds['width'] == 1440 and bounds['height'] == 900, bounds
    expect(page.locator('.mahoraga-wheel')).to_have_css('animation-iteration-count', '1')
    page.screenshot(path=str(OUT / 'mahoraga-desktop.png'))
    expect(intro).not_to_be_visible(timeout=6000)
    assert page.evaluate('document.body.style.overflow') != 'hidden'
    expect(page.locator('#hero-title')).to_be_visible()
    page.locator('a[href="/work/chaintrace"]').first.click()
    expect(page).to_have_url(BASE + '/work/chaintrace')
    expect(intro).not_to_be_visible()
    page.goto(BASE, wait_until='domcontentloaded')
    expect(intro).to_be_visible()
    page.locator('.intro-skip').click()
    expect(intro).not_to_be_visible()
    page.reload(wait_until='domcontentloaded')
    expect(intro).to_be_visible()
    # Wait for hydration to upgrade the initial dialog into a modal.
    page.wait_for_function('document.querySelector(".domain-intro").matches(":modal")')
    page.keyboard.press('Escape')
    expect(intro).not_to_be_visible()
    assert page.evaluate('document.body.style.overflow') != 'hidden'
    page.set_viewport_size({'width': 375, 'height': 812})
    page.reload(wait_until='domcontentloaded')
    expect(intro).to_be_visible()
    page.screenshot(path=str(OUT / 'mahoraga-mobile.png'))
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    expect(intro).not_to_be_visible(timeout=6000)
    page.emulate_media(reduced_motion='reduce')
    page.reload(wait_until='networkidle')
    expect(intro).not_to_be_visible()
    assert page.evaluate('document.body.style.overflow') != 'hidden'
    nojs = browser.new_context(java_script_enabled=False)
    static_page = nojs.new_page()
    static_page.goto(BASE)
    expect(static_page.locator('.domain-intro')).not_to_be_visible(timeout=6000)
    expect(static_page.locator('#hero-title')).to_be_visible()
    assert not errors, errors
    browser.close()
    print('PASS: one spin, reveal, navigation, reload, skip, Escape, mobile, reduced motion, no JavaScript; no browser errors.')
