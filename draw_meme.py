#!/usr/bin/env python3
"""Compose the gta6-meme-x-01 meme: generated Vice City scene + official
make.fun mark badge + PIL text (correct spelling guaranteed).

Layout (1024x1024):
- Official mark-1024.png badge, top-left (brand recognition at 480x480).
- Top text in the sky gap between the five stars and the ghost's head.
- Bottom punchline, one line on the dark road below the car.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths are resolved relative to this script, never the working directory,
# so the meme rebuilds identically from any cwd.
BASE = Path(__file__).resolve().parent
SRC = BASE / "media-generation-scene-0-2bf29105-a6c6-4f56-9048-2524c058d7df.png"
MARK = BASE.parent / "gta6-meme-x-01-assets" / "mark-1024.png"
OUT = BASE / "meme.png"
SIZE = 1024
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
MAGENTA = (230, 0, 122, 255)
WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)

img = Image.open(SRC).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
d = ImageDraw.Draw(img, "RGBA")

# --- official mark badge, top-left, with soft shadow ---
mark = Image.open(MARK).convert("RGBA").resize((150, 150), Image.LANCZOS)
shadow = Image.new("RGBA", (170, 170), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow)
sd.ellipse((8, 8, 162, 162), fill=(0, 0, 0, 110))
shadow = shadow.filter(ImageFilter.GaussianBlur(6))
img.paste(shadow, (4, 4), shadow)
img.paste(mark, (12, 12), mark)


def text_center(y, segments, size, stroke=4):
    """segments: list of (text, fill). Returns total width."""
    font = ImageFont.truetype(BOLD, size)
    widths = [d.textlength(t, font=font) for t, _ in segments]
    total = sum(widths)
    x = (SIZE - total) // 2
    for (t, fill), w in zip(segments, widths):
        d.text((x, y), t, font=font, fill=fill,
               stroke_width=stroke, stroke_fill=BLACK)
        x += w
    return total


# --- top hook: sky gap between stars and ghost head ---
text_center(185, [("STILL NO GTA VI.", WHITE)], 58, stroke=5)

# --- bottom punchline: one line on the road, auto-fit to <= 980 px ---
size = 46
full = "SO HE EARNS REAL MONEY ON make.fun"
while True:
    font = ImageFont.truetype(BOLD, size)
    if d.textlength(full, font=font) <= 980 or size <= 30:
        break
    size -= 1
print("bottom font size:", size)
text_center(935,
            [("SO HE EARNS REAL MONEY ON ", WHITE), ("make.fun", MAGENTA)],
            size, stroke=4)

# The posted meme.png is a 256-colour palette PNG (kept under 1 MiB):
# quantize the composed RGB image with PIL's median-cut quantizer.
# Without this step the output is a 1.5 MB RGB PNG whose pixels differ
# slightly from the posted file.
img = img.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
img.save(OUT, optimize=True)
print("saved", OUT, img.size, img.mode)
