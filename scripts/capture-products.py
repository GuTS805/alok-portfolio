"""Capture public product pages without submitting forms or transactions."""
import json, pathlib
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'projects'
OUT.mkdir(exist_ok=True)
urls = {
    'botvue': 'https://botvue.onrender.com',
    'hangr': 'https://hangr-ruby.vercel.app',
    'nagrikflow': 'https://nagrikflow-five.vercel.app',
    'closing-bell': 'https://closing-bell-eight.vercel.app',
}
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    context = browser.new_context(viewport={'width':1440, 'height':960}, device_scale_factor=1, reduced_motion='reduce')
    for slug, url in urls.items():
        page = context.new_page()
        try:
            response = page.goto(url, wait_until='domcontentloaded', timeout=90000)
            page.wait_for_timeout(6500)
            print(json.dumps({'slug':slug, 'status':response.status, 'url':page.url, 'title':page.title(), 'text':page.locator('body').inner_text()[:1500]}), flush=True)
            if response.status == 200:
                page.screenshot(path=str(OUT / f'{slug}.png'))
                im = Image.open(OUT / f'{slug}.png')
                for width in [720, 1440]:
                    copy = im.copy()
                    copy.thumbnail((width, width))
                    copy.save(OUT / f'{slug}-{width}.webp', quality=88)
        except Exception as e:
            print(json.dumps({'slug':slug, 'error':str(e)}), flush=True)
        page.close()
    browser.close()
