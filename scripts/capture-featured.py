from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/projects'
def save(page, slug):
    page.screenshot(path=str(OUT / f'{slug}.png'))
    image = Image.open(OUT / f'{slug}.png')
    for width in [720, 1440]:
        copy = image.copy(); copy.thumbnail((width, width))
        copy.save(OUT / f'{slug}-{width}.webp', quality=88)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    context = browser.new_context(viewport={'width':1440, 'height':960}, reduced_motion='reduce')
    page = context.new_page()
    page.goto('http://127.0.0.1:3100/login', wait_until='networkidle', timeout=90000)
    print(page.locator('body').inner_text()[:1800], flush=True)
    page.locator('input').first.fill('i4c.analyst')
    page.locator('input[type=password]').fill('Chain@2026')
    page.get_by_role('button', name='Sign in', exact=False).click()
    page.wait_for_timeout(5000)
    print('CHAINTRACE', page.url, page.locator('body').inner_text()[:1500], flush=True)
    page.goto('http://127.0.0.1:3100/wallets/0xb8d31a8c81282ce8cda98988e14f014b2c36edc3', wait_until='networkidle', timeout=90000)
    page.wait_for_timeout(4000)
    print('WALLET', page.locator('body').inner_text()[:2500], flush=True)
    save(page, 'chaintrace')
    response = page.goto('https://botvue.onrender.com', wait_until='domcontentloaded', timeout=90000)
    page.wait_for_timeout(12000)
    # Render's cold-start page may reload itself. Inspect the resulting document.
    text = page.locator('body').inner_text()
    print('BOTVUE', page.title(), text[:2000], flush=True)
    if 'SERVICE WAKING UP' not in text and 'Application loading' not in page.title():
        save(page, 'botvue')
    browser.close()
