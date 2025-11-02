from PIL import Image
import os

# Load the optimized image
img = Image.open('bizley/assets/images/David_optimized.png')

# Convert to RGB for JPEG
if img.mode in ('RGBA', 'P'):
    img = img.convert('RGB')

# Save as high-quality JPEG
img.save('bizley/assets/images/David.jpg', 'JPEG', quality=85, optimize=True)

# Also update PNG with better compression
img.save('bizley/assets/images/David.png', 'PNG', optimize=True)

jpeg_size = os.path.getsize('bizley/assets/images/David.jpg') / 1024
png_size = os.path.getsize('bizley/assets/images/David.png') / 1024

print(f'JPEG version: {jpeg_size:.1f}KB')
print(f'PNG version: {png_size:.1f}KB')
print(f'Dimensions: {img.size}')
print(f'\nRecommendation: Use David.jpg (much smaller, same quality for photos)')
