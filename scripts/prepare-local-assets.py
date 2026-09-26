from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / '.preview-sources/python-tools'))
from fontTools.ttLib import TTFont
from fontTools import subset
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
fonts = ROOT / 'public/fonts'
for source in fonts.glob('*.ttf'):
    font = TTFont(source)
    options = subset.Options()
    options.flavor = 'woff2'
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=list(range(0x20, 0x180)) + list(range(0x2000, 0x2070)) + [0x2190, 0x2191, 0x2192, 0x2193, 0x2197, 0x2198, 0x21b3, 0x2713, 0x00d7])
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(source.with_suffix('.woff2'))

# Original typographic social artwork; no anime/character artwork is reused.
image = Image.new('RGB', (1200, 630), '#090807')
d = ImageDraw.Draw(image)
display = ImageFont.truetype(str(fonts / 'HTxwL3I-JCGChYJ8VI-L6OO_au7B47b1_3E.ttf'), 122)
small = ImageFont.truetype(str(fonts / '-F63fjptAgt5VM-kVkqdyU8n5ig.ttf'), 20)
d.rectangle((36, 36, 1164, 594), outline='#392923', width=2)
d.text((70, 66), 'ALOK SRIVASTAVA / DEVELOPER & BUILDER', font=small, fill='#b5aaa3')
d.text((70, 128), 'BUILD WITHOUT', font=display, fill='#f2eee7')
d.text((70, 267), 'LIMITS.', font=display, fill='#e83432')
d.line((760, 470, 1125, 270), fill='#e83432', width=2)
d.text((70, 533), 'FULL-STACK DEVELOPMENT. UNRESTRICTED.', font=small, fill='#b5aaa3')
image.save(ROOT / 'public/social-preview.png', optimize=True)
print('WOFF2 fonts and original social graphic prepared')
