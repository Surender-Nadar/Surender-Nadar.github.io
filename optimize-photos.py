#!/usr/bin/env python3
"""Shrink your photos so the site loads fast.

Run once from the project folder:   pip install pillow   then   python3 optimize-photos.py

Works with .jpg / .jpeg / .png / .webp, e.g. photos/1.jpeg ... photos/24.jpeg
and a portrait named portrait.jpeg either in photos/ or in the main folder.

What it does:
  1. Moves your originals into photos-original/ (a backup, never deployed).
  2. Writes photos/1.jpg, 2.jpg ...      (max 1200px) for the pop-up viewer.
  3. Writes photos/t/1.jpg, 2.jpg ...    (max 420px) for the scattered pile.
  4. Writes portrait.jpg (640px) in the main folder for the hero.
Then set COUNT in main.js to the number it prints.
"""
import os, re, shutil, sys
from PIL import Image, ImageOps

SRC, BAK = "photos", "photos-original"
EXT = (".jpg", ".jpeg", ".png", ".webp")
IS_PORTRAIT = re.compile(r"^portrait\.(jpe?g|png|webp)$", re.I)
natural = lambda s: [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

if os.path.isdir(BAK) and os.listdir(BAK):
    sys.exit(f"{BAK}/ already has files, so this was probably run before.\n"
             f"Put your ORIGINAL photos back into {SRC}/ (and portrait), empty {BAK}/, then run again.")

def save(img, path, side, q):
    im = img.copy(); im.thumbnail((side, side), Image.LANCZOS)
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    return os.path.getsize(path) // 1024

os.makedirs(BAK, exist_ok=True); os.makedirs(os.path.join(SRC, "t"), exist_ok=True)

# portrait: look in the main folder and in photos/
for folder in (".", SRC):
    for f in os.listdir(folder):
        if IS_PORTRAIT.match(f):
            kept = os.path.join(BAK, f"portrait-from-{'root' if folder == '.' else SRC}-{f}")
            shutil.move(os.path.join(folder, f), kept)
            img = ImageOps.exif_transpose(Image.open(kept)).convert("RGB")
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
