import concurrent.futures, io, json, pathlib, requests, zipfile
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'research'

def read(url):
    response = requests.get(url, timeout=40)
    response.raise_for_status()
    return response

def task(kind):
    if kind == 'chaintrace':
        response = read('https://codeload.github.com/GuTS805/Chaintrace/zip/refs/heads/main')
        dest = ROOT / '.preview-sources'
        dest.mkdir(exist_ok=True)
        with zipfile.ZipFile(io.BytesIO(response.content)) as z:
            for entry in z.infolist():
                target = (dest / entry.filename).resolve()
                if not target.is_relative_to(dest.resolve()):
                    raise ValueError('Unsafe archive path')
            z.extractall(dest)
        return 'Chaintrace source downloaded for genuine local app screenshot'
    if kind == 'hangr':
        (OUT / 'hangr-README.md').write_text(read('https://raw.githubusercontent.com/GuTS805/hangr/main/spontaneous-meetup/README.md').text, encoding='utf-8')
        return 'Hangr readme saved'
    if kind == 'advisories':
        found = []
        for repo in ['joinmarket-ng/joinmarket-ng', 'joinmarket-webui/jam', 'ankidroid/Anki-Android']:
            response = requests.get(f'https://api.github.com/repos/{repo}/security-advisories', timeout=30)
            if response.status_code != 200:
                continue
            for item in response.json():
                if 'guts805' in json.dumps(item).lower():
                    found.append(item)
        (OUT / 'advisories.json').write_text(json.dumps(found, indent=2), encoding='utf-8')
        return [{'title': x['summary'], 'url': x['html_url'], 'credits': x.get('credits')} for x in found]
    if kind == 'fonts':
        folder = ROOT / 'public' / 'fonts'
        folder.mkdir(exist_ok=True)
        # Google Fonts stylesheet is downloaded once; self-hosted fonts avoid runtime requests.
        import re
        url = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'
        css = requests.get(url, headers={'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}, timeout=30).text
        rules = []
        for rule in re.findall(r'@font-face\s*\{[^}]+\}', css):
            match = re.search(r'url\((https[^)]+)\)', rule)
            if not match: continue
            remote = match.group(1)
            name = remote.split('/')[-1]
            (folder / name).write_bytes(read(remote).content)
            rules.append(rule.replace(remote, '/fonts/' + name))
        (folder / 'fonts.css').write_text('\n'.join(rules), encoding='utf-8')
        return f'{len(rules)} latin font faces self-hosted'

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(task, ['chaintrace', 'hangr', 'advisories', 'fonts']):
        print(json.dumps(result))

image = Image.open(ROOT / 'public' / 'malevolent-shrine.png')
for width in [640, 960, 1536]:
    copy = image.copy()
    copy.thumbnail((width, width))
    copy.save(ROOT / 'public' / f'shrine-{width}.webp', quality=85)
