"""Browser checks against a running production server (Edge + Python Playwright)."""
from pathlib import Path
import json, os, re, sys
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts'
OUT.mkdir(exist_ok=True)
BASE = os.environ.get('PORTFOLIO_URL', 'http://127.0.0.1:3200')
SIZES = [(320,568),(375,812),(390,844),(768,1024),(1024,768),(1440,900),(1920,1080)]
SLUGS = ['chaintrace','botvue','hangr','nagrikflow','closing-bell']

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    context = browser.new_context(viewport={'width':1440,'height':900}, permissions=['clipboard-read','clipboard-write'])
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(BASE, wait_until='networkidle')
    assert response.status == 200
    expect(page.locator('.domain-intro')).not_to_be_visible(timeout=6000)
    expect(page.locator('#hero-title')).to_have_text('BUILDWITHOUTLIMITS.')
    assert page.locator('video').count() == 0, 'Entrance must not load the legacy video'
    assert page.locator('iframe').count() == 0, 'Audio must remain opt-in'
    assert page.evaluate('document.body.style.overflow') != 'hidden'
    expect(page.locator('.hero-support')).to_have_css('opacity', '1', timeout=6000)
    # Signature transition: repeated clicks cannot stack; Escape safely cancels.
    trigger = page.locator('.domain-trigger')
    trigger.click()
    expect(trigger).to_have_attribute('aria-disabled', 'true')
    trigger.evaluate('(e) => { e.click(); e.click(); }')
    page.keyboard.press('Escape')
    expect(trigger).to_have_attribute('aria-disabled', 'false')
    assert page.locator('.hero').get_attribute('data-collapse') is None
    trigger.click()
    page.wait_for_timeout(1800)
    assert page.evaluate('document.activeElement.id') == 'work-title'
    assert page.locator('#work').bounding_box()['y'] < 160
    expect(trigger).to_have_attribute('aria-disabled', 'false')
    # Pointer effects are reset when motion pauses.
    page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
    page.mouse.move(1200, 300)
    page.wait_for_timeout(100)
    assert page.locator('.hero').evaluate('(e) => e.style.getPropertyValue("--pointer-x")') != ''
    page.get_by_role('button', name='PAUSE MOTION').click()
    expect(page.locator('html')).to_have_attribute('data-motion', 'paused')
    assert page.locator('.hero').evaluate('(e) => e.style.getPropertyValue("--pointer-x")') == '0px'
    page.get_by_role('button', name='PLAY MOTION').click()
    page.get_by_role('button', name='DOMAIN OFF', exact=True).click()
    expect(page.locator('html')).to_have_attribute('data-domain', 'on')
    page.reload(wait_until='networkidle')
    expect(page.locator('html')).to_have_attribute('data-domain', 'on')
    page.get_by_role('button', name='DOMAIN ON', exact=True).click()
    page.emulate_media(reduced_motion='reduce')
    # Audio uses the preserved external track only after an explicit click.
    page.route('https://www.youtube-nocookie.com/**', lambda route: route.fulfill(status=200, body='<html><body>Test media frame</body></html>'))
    page.get_by_role('button', name='SOUND OFF', exact=True).click()
    expect(page.locator('.sound-frame')).to_have_attribute('src', re.compile('vxTLtmpnKn8'))
    page.get_by_role('button', name='SOUND ON', exact=True).click()
    expect(page.locator('.sound-frame')).to_have_count(0)
    # Direct navigation and reduced-motion behavior.
    trigger.click()
    expect(page.locator('#work-title')).to_be_focused()
    assert page.locator('.hero').get_attribute('data-collapse') is None
    assert page.locator('.embers').evaluate('(e) => getComputedStyle(e).display') == 'none'
    if '--motion-only' not in sys.argv:
        for slug in SLUGS:
            assert page.goto(BASE + '/work/' + slug, wait_until='networkidle').status == 200
            expect(page.locator('h1')).to_have_count(1)
            assert 'Alok Srivastava' in page.title()
            for section in ['problem','solution','architecture','challenges','implementation','results','links']:
                expect(page.locator('#'+section)).to_be_visible()
            page.reload(wait_until='networkidle')
            assert page.locator('img').first.evaluate('(e) => e.complete && e.naturalWidth > 0')
            page.locator('.case-back').click()
            page.wait_for_url('**/#work')
            page.go_back(wait_until='networkidle')
            page.wait_for_url('**/work/'+slug)
            assert page.url.endswith('/work/'+slug)
            page.go_forward(wait_until='networkidle')
            page.wait_for_url('**/#work')
            assert page.url.endswith('/#work')
        assert context.request.get(BASE+'/work/no-such-project').status == 404
        page.goto(BASE, wait_until='networkidle')
        # All home links point to real sections or dedicated routes.
        for href in page.locator('a[href^="#"]').evaluate_all('(els)=>els.map(e=>e.getAttribute("href"))'):
            assert page.locator(href).count(), href
        for href in page.locator('a[target="_blank"]').evaluate_all('(els)=>els.map(e=>({href:e.href,rel:e.rel}))'):
            assert href['href'].startswith('https://') and 'noopener' in href['rel']
        assert page.locator('a[href="mailto:alok020505@gmail.com"]').count() >= 2
        assert page.locator('a[href="https://www.linkedin.com/in/alok-srivastava-7a6391329/"]').count() == 1
        resume = context.request.get(BASE+'/resume.pdf')
        assert resume.status == 200 and resume.body()[:4] == b'%PDF'
        assert context.request.get(BASE+'/social-preview.png').status == 200
        assert context.request.get(BASE+'/sitemap.xml').status == 200
        assert context.request.get(BASE+'/robots.txt').status == 200
        page.locator('#copy-email').click()
        expect(page.locator('.copy-status')).to_have_text('COPIED TO CLIPBOARD')
        assert page.evaluate('navigator.clipboard.readText()') == 'alok020505@gmail.com'
        page.evaluate('() => { navigator.clipboard.writeText = async () => { throw new Error("Denied"); }; }')
        page.locator('#copy-email').click()
        expect(page.locator('.copy-status')).to_contain_text('Copy unavailable')
        # Palette focus, keyboard navigation, Escape, and command action.
        palette_trigger = page.get_by_role('button', name='Open command palette')
        palette_trigger.click()
        expect(page.locator('.command-palette')).to_be_visible()
        page.keyboard.press('ArrowDown')
        expect(page.locator('.command-list a').first).to_be_focused()
        page.keyboard.press('ArrowDown')
        expect(page.locator('.command-list a').nth(1)).to_be_focused()
        page.keyboard.press('Escape')
        expect(palette_trigger).to_be_focused()
        page.keyboard.press('Control+k')
        expect(page.locator('.command-palette')).to_be_visible()
        page.get_by_role('link', name='Go to About').click()
        expect(page.locator('.command-palette')).not_to_be_visible()
        assert page.url.endswith('#about')
        assert page.evaluate('document.body.style.overflow') != 'hidden'
        # Illustrative comparison is an actual control.
        demo = page.locator('.crawler-demo')
        demo.get_by_role('button', name='SHOW MATCHING').click()
        expect(demo).to_contain_text('RESPONSES MATCH')
        demo.get_by_role('button', name='SHOW DIVERGENCE').click()
        expect(demo).to_contain_text('DIVERGENCE DETECTED')
        # Every requested viewport, including all sections and case-study layout.
        for width, height in SIZES:
            page.set_viewport_size({'width':width,'height':height})
            page.goto(BASE, wait_until='networkidle')
            for section in ['top','work','about','open-source','contact']:
                page.locator('#'+section).scroll_into_view_if_needed()
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{width} / {section}: overflow'
            for img in page.locator('img').all():
                img.evaluate('(e) => e.loading="eager"')
            page.wait_for_function('Array.from(document.images).every(i => i.complete && i.naturalWidth > 0)')
            page.evaluate('scrollTo({top:0,behavior:"instant"})')
            page.screenshot(path=str(OUT/f'home-{width}.png'), full_page=True)
            if width < 768:
                menu = page.get_by_role('button', name='Open navigation menu')
                menu.click()
                expect(page.locator('#mobile-navigation')).to_be_visible()
                page.keyboard.press('Shift+Tab')
                assert page.evaluate('document.activeElement.closest("#mobile-navigation") !== null')
                page.keyboard.press('Escape')
                expect(menu).to_be_focused()
                for name, target in [('Work','work'),('About','about'),('Open source','open-source'),('Contact','contact')]:
                    menu.click()
                    page.get_by_role('navigation', name='Mobile navigation').get_by_role('link',name=name).click()
                    expect(page.locator('#mobile-navigation')).not_to_be_visible()
                    assert page.url.endswith('#'+target)
                    assert page.evaluate('document.body.style.overflow') != 'hidden'
            page.goto(BASE+'/work/closing-bell', wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'{width}: case overflow'
            print(f'PASS {width}x{height}', flush=True)
        # Static content and ordinary links work even with JavaScript disabled.
        static = browser.new_context(java_script_enabled=False, viewport={'width':390,'height':844})
        nojs = static.new_page()
        assert nojs.goto(BASE).status == 200
        expect(nojs.locator('#hero-title')).to_be_visible()
        # Without JavaScript the entrance is released by CSS alone (~3.2s); wait for it
        # rather than racing the click against the still-open dialog.
        expect(nojs.locator('.domain-intro')).not_to_be_visible(timeout=6000)
        nojs.locator('.domain-trigger').click()
        assert nojs.url.endswith('#work')
        assert nojs.goto(BASE+'/work/chaintrace').status == 200
        static.close()
    assert not errors, errors
    result = {'result':'passed','viewports':SIZES,'project_routes':5,'collapse_and_cancellation':'passed','motion_and_audio':'passed','keyboard_and_mobile_menu':'passed','clipboard_success_and_failure':'passed','resume':'valid PDF','browser_history':'passed','no_javascript_fallback':'passed','javascript_errors':errors}
    if '--motion-only' in sys.argv:
        result = {'result':'passed','hero_entrance':'passed','collapse_and_cancellation':'passed','reduced_motion':'passed','javascript_errors':errors}
    (OUT / ('motion-verification.json' if '--motion-only' in sys.argv else 'functional-verification.json')).write_text(json.dumps(result, indent=2))
    print(json.dumps(result))
    browser.close()
