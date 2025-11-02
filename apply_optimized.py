#!/usr/bin/env python3
"""
Apply optimized images - replaces original images with optimized versions
Run this AFTER running optimize_images.py and reviewing the results
"""

import os
import shutil

def main():
    """Replace original images with optimized versions"""
    source_dir = "images_optimized"
    target_dir = "images"
    
    if not os.path.exists(source_dir):
        print("❌ Error: 'images_optimized' folder not found!")
        print("Please run 'python optimize_images.py' first.")
        return
    
    print("=" * 60)
    print("APPLYING OPTIMIZED IMAGES")
    print("=" * 60)
    print()
    print("⚠️  WARNING: This will replace your original images!")
    print("    Backups are saved in 'images_backup' folder.")
    print()
    
    response = input("Continue? (yes/no): ").strip().lower()
    
    if response not in ['yes', 'y']:
        print("\n❌ Cancelled.")
        return
    
    print()
    
    # Get all optimized images
    files = [f for f in os.listdir(source_dir) 
             if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not files:
        print("❌ No optimized images found!")
        return
    
    # Copy optimized images to main folder
    for filename in files:
        source = os.path.join(source_dir, filename)
        target = os.path.join(target_dir, filename)
        
        shutil.copy2(source, target)
        print(f"✓ Replaced: {filename}")
    
    print()
    print("=" * 60)
    print("✅ COMPLETE!")
    print("=" * 60)
    print(f"Replaced {len(files)} images with optimized versions.")
    print("Your website images are now compressed and ready to use!")
    print()

if __name__ == "__main__":
    main()
