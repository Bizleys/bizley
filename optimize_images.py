#!/usr/bin/env python3
"""
Image Optimization Script for Bizley Website
Compresses images to reduce file size while maintaining quality
"""

from PIL import Image
import os
import shutil

# Configuration
INPUT_DIR = "images"
OUTPUT_DIR = "images_optimized"
BACKUP_DIR = "images_backup"

# Quality settings (0-100, higher = better quality but larger file)
JPEG_QUALITY = 85  # Good balance between quality and size
PNG_COMPRESSION = 6  # 0-9, higher = more compression

# Max dimensions (images larger than this will be resized)
MAX_WIDTH = 1920
MAX_HEIGHT = 1920

def optimize_image(input_path, output_path):
    """Optimize a single image file"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB for JPEG (if needed)
            if img.mode in ('RGBA', 'LA', 'P'):
                if input_path.lower().endswith('.jpg') or input_path.lower().endswith('.jpeg'):
                    # Create white background for transparent images
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
            
            # Resize if image is too large
            if img.width > MAX_WIDTH or img.height > MAX_HEIGHT:
                img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
                print(f"  → Resized to {img.width}×{img.height}")
            
            # Get file extension
            ext = os.path.splitext(input_path)[1].lower()
            
            # Save with optimization
            if ext in ['.jpg', '.jpeg']:
                img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
            elif ext == '.png':
                img.save(output_path, 'PNG', optimize=True, compress_level=PNG_COMPRESSION)
            else:
                img.save(output_path, optimize=True)
            
            # Compare file sizes
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100
            
            print(f"  ✓ Original: {original_size/1024:.1f}KB → Optimized: {optimized_size/1024:.1f}KB")
            print(f"  ✓ Reduced by {reduction:.1f}%")
            
            return True
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    """Main optimization process"""
    # Create directories
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    print("=" * 60)
    print("IMAGE OPTIMIZATION SCRIPT")
    print("=" * 60)
    
    # Get all image files
    image_files = [f for f in os.listdir(INPUT_DIR) 
                   if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not image_files:
        print("No images found in 'images' directory!")
        return
    
    print(f"\nFound {len(image_files)} images to optimize\n")
    
    total_original = 0
    total_optimized = 0
    
    # Process each image
    for i, filename in enumerate(image_files, 1):
        print(f"[{i}/{len(image_files)}] Processing: {filename}")
        
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)
        backup_path = os.path.join(BACKUP_DIR, filename)
        
        # Backup original
        shutil.copy2(input_path, backup_path)
        
        # Optimize
        if optimize_image(input_path, output_path):
            total_original += os.path.getsize(input_path)
            total_optimized += os.path.getsize(output_path)
        
        print()
    
    # Summary
    print("=" * 60)
    print("OPTIMIZATION COMPLETE!")
    print("=" * 60)
    print(f"Total original size:  {total_original/1024/1024:.2f} MB")
    print(f"Total optimized size: {total_optimized/1024/1024:.2f} MB")
    print(f"Total savings:        {(total_original-total_optimized)/1024/1024:.2f} MB")
    print(f"Reduction:            {((total_original-total_optimized)/total_original)*100:.1f}%")
    print()
    print(f"✓ Optimized images saved to: {OUTPUT_DIR}/")
    print(f"✓ Original images backed up to: {BACKUP_DIR}/")
    print()
    print("To use optimized images:")
    print("  1. Review images in 'images_optimized' folder")
    print("  2. If satisfied, replace files in 'images' folder")
    print("  3. Or run: python apply_optimized.py")
    print()

if __name__ == "__main__":
    main()
