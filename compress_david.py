from PIL import Image
import os

# Compress the optimized image
img = Image.open('bizley/assets/images/David_optimized.png')

# Convert to RGB if needed and save as optimized PNG
if img.mode == 'RGBA':
    img = img.convert('RGB')

img.save('bizley/assets/images/David.png', 'PNG', optimize=True, compress_level=9)

size = os.path.getsize('bizley/assets/images/David.png') / 1024
print(f'Final optimized David.png size: {size:.1f}KB')
print(f'New dimensions: {img.size}')
print('\nDavid.png has been replaced with the optimized version!')
