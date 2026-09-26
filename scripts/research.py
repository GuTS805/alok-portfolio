"""Read-only public-source audit; stores provenance for portfolio content."""
import concurrent.futures, json, pathlib, requests

OUT = pathlib.Path(__file__).resolve().parents[1] / 'research'
OUT.mkdir(exist_ok=True)
SESSION = requests.Session()
SESSION.headers['User-Agent'] = 'Alok-Portfolio-Content-Audit'

def fetch_repo(name):
    base = f'https://api.github.com/repos/GuTS805/{name}'
    tree = SESSION.get(base + '/git/trees/main?recursive=1', timeout=30)
    tree.raise_for_status()
    data = tree.json()
    (OUT / f'{name}-tree.json').write_text(json.dumps(data, indent=2), encoding='utf-8')
    paths = [x['path'] for x in data.get('tree', [])]
    readme = next((x for x in paths if x.lower() == 'readme.md'), None)
    if readme:
        r = SESSION.get(f'https://raw.githubusercontent.com/GuTS805/{name}/main/{readme}', timeout=30)
        r.raise_for_status()
        (OUT / f'{name}-README.md').write_text(r.text, encoding='utf-8')
    images = [x for x in paths if x.lower().endswith(('.png', '.webp', '.jpg', '.jpeg'))]
    return {'repo': name, 'images': images, 'docs': [x for x in paths if x.endswith('.md')][:35]}

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        for result in pool.map(fetch_repo, ['Chaintrace', 'Botvue', 'hangr', 'NagrikFlow', 'Closing-Bell']):
            print(json.dumps(result))
    for label, query in [('ankidroid', 'is:pr author:GuTS805 repo:ankidroid/Anki-Android is:merged'), ('joinmarket', 'is:pr author:GuTS805 org:joinmarket-ng is:merged'), ('jam', 'is:pr author:GuTS805 repo:joinmarket-webui/jam is:merged')]:
        r = SESSION.get('https://api.github.com/search/issues', params={'q': query, 'per_page': 10}, timeout=30)
        r.raise_for_status()
        data = r.json()
        (OUT / f'{label}-contributions.json').write_text(json.dumps(data, indent=2), encoding='utf-8')
        print(json.dumps({'group': label, 'count': data.get('total_count'), 'items': [{'title': x['title'], 'url': x['html_url'], 'body': x.get('body', '')[:1800], 'pull_request': x.get('pull_request')} for x in data.get('items', [])]}))
