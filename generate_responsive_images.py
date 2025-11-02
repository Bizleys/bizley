#!/usr/bin/env python3
"""
Generate responsive image variants (WebP + JPEG/PNG fallbacks)
- Reads images from images/
- Writes variants to images/responsive/
- Sizes: 480, 768, 1200, 1600 (only up to source width)
- Keeps spaces in file names (safe in HTML as attributes are quoted)
"""
from PIL import Image
import os

INPUT_DIR = 'images'
OUTPUT_DIR = os.path.join(INPUT_DIR, 'responsive')
SIZES = [480, 768, 1200, 1600]

os.makedirs(OUTPUT_DIR, exist_ok=True)

SUPPORTED = ('.jpg','.jpeg','.png')

def make_variants(path):
    fn = os.path.basename(path)
    name, ext = os.path.splitext(fn)
    ext = ext.lower()

    with Image.open(path) as im:
        im = im.convert('RGBA') if ext == '.png' else im.convert('RGB')
        orig_w, orig_h = im.size
        for w in SIZES:
            if w >= orig_w:
                # Don't upscale; create one at original width cap
                target_w = orig_w
            else:
                target_w = w
            scale = target_w / orig_w
            target_h = int(orig_h * scale)

            # Avoid duplicate same-size outputs
            suffix = f"-{target_w}"

            # Save WebP
            webp_path = os.path.join(OUTPUT_DIR, f"{name}{suffix}.webp")
            if not os.path.exists(webp_path):
                im.resize((target_w, target_h), Image.Resampling.LANCZOS).save(
                    webp_path, 'WEBP', quality=80, method=6
                )

            # Save fallback JPEG/PNG
            if ext in ('.jpg','.jpeg'):
                out_path = os.path.join(OUTPUT_DIR, f"{name}{suffix}.jpg")
                fmt = 'JPEG'
                params = dict(quality=85, optimize=True, progressive=True)
            else:
                # For PNG photos, provide JPEG fallback (usually smaller)
                out_path = os.path.join(OUTPUT_DIR, f"{name}{suffix}.jpg")
                fmt = 'JPEG'
                params = dict(quality=85, optimize=True, progressive=True)
            if not os.path.exists(out_path):
                # Flatten against white if transparent
                frame = Image.new('RGB', im.size, (255,255,255))
                frame.paste(im, mask=im.split()[-1] if im.mode == 'RGBA' else None)
                frame.resize((target_w, target_h), Image.Resampling.LANCZOS).save(out_path, fmt, **params)

if __name__ == '__main__':
    files = [f for f in os.listdir(INPUT_DIR) if os.path.splitext(f)[1].lower() in SUPPORTED]
    if not files:
        print('No images found.')
    for f in files:
        print('Processing', f)
        make_variants(os.path.join(INPUT_DIR, f))
    print('Done. Variants in', OUTPUT_DIR)
