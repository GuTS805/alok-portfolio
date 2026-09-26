import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('PORTFOLIO_URL', 'http://127.0.0.1:3200')
axe = ROOT / '.preview-sources/audit/node_modules/axe-core/axe.min.js'
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width':1440,'height':900}, reduced_motion='reduce')
    results = []
    for route in ['', '/work/chaintrace', '/work/botvue', '/work/hangr', '/work/nagrikflow', '/work/closing-bell']:
        page.goto(BASE + route, wait_until='networkidle')
        page.add_script_tag(path=str(axe))
        result = page.evaluate('async () => {const r = await axe.run(document, {runOnly: {type:"tag",values:["wcag2a","wcag2aa","wcag21aa","best-practice"]}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:r.passes.length};}')
        results.append({'route':route or '/', **result})
        print(json.dumps(results[-1]), flush=True)
    page.set_viewport_size({'width':320,'height':568})
    page.goto(BASE, wait_until='networkidle')
    page.get_by_role('button', name='Open navigation menu').click()
    page.add_script_tag(path=str(axe))
    result = page.evaluate('async () => {const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}')
    results.append({'route':'mobile menu','violations':result})
    print(json.dumps(results[-1]), flush=True)
    (ROOT/'artifacts/accessibility.json').write_text(json.dumps(results,indent=2))
    browser.close()
    assert all(not item['violations'] for item in results), 'Accessibility issues require review'
