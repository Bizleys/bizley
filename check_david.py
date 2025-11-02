from PIL import Image
import os

img = Image.open('bizley/assets/images/David.jpg')
print(f'Current size: {img.size[0]}x{img.size[1]}')
print(f'Format: {img.format}, Mode: {img.mode}')
size = os.path.getsize('bizley/assets/images/David.jpg') / 1024
print(f'File size: {size:.1f}KB')
