#!/usr/bin/env python3
"""Shrink your photos so the site loads fast.

Run once from this folder:   pip install pillow   then   python3 optimize-photos.py

What it does:
  1. Moves everything in photos/ (and portrait.*) into photos-original/ as a backup.
  2. Writes photos/1.jpg, 2.jpg ... (max 1200px, small file) for the pop-up viewer.
  3. Writes photos/t/1.jpg, 2.jpg ... (max 420px) for the scattered pile.
  4. Writes a 640px portrait.jpg for the hero.
Then set COUNT in main.js to the number it prints.
"""
import os, re, shutil
from PIL import Image, ImageOps

SRC, BAK = "photos", "photos-original"
EXT = (".jpg", ".jpeg", ".png", ".webp")
natural = lambda s: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

def save(img, path, side, q):
    im = img.copy(); im.thumbnail((side, side), Image.LANCZOS)
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    return os.path.getsize(path) // 1024

os.makedirs(BAK, exist_ok=True); os.makedirs(os.path.join(SRC, "t"), exist_ok=True)

# portrait
for f in os.listdir("."):
    if re.match(r"portrait\.(jpe?g|png|webp)$", f, re.I):
        shutil.move(f, os.path.join(BAK, f))
        img = ImageOps.exif_transpose(Image.open(os.path.join(BAK, f))).convert("RGB")
        print("portrait.jpg", save(img, "portrait.jpg", 640, 80), "KB")

files = sorted((f for f in os.listdir(SRC) if f.lower().endswith(EXT) and os.path.isfile(os.path.join(SRC, f))), key=natural)
for f in files:
    shutil.move(os.path.join(SRC, f), os.path.join(BAK, "photo-" + f))
for n, f in enumerate(files, 1):
    img = ImageOps.exif_transpose(Image.open(os.path.join(BAK, "photo-" + f))).convert("RGB")
    a = save(img, os.path.join(SRC, f"{n}.jpg"), 1200, 78)
    b = save(img, os.path.join(SRC, "t", f"{n}.jpg"), 420, 72)
    print(f"{f} -> {n}.jpg ({a} KB) + t/{n}.jpg ({b} KB)")
print(f"\nDone. {len(files)} photos. Set COUNT = {len(files)} in main.js.")
