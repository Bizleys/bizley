"""
Optimize David.png for better panel fit by:
1. Smart cropping to improve composition
2. Resizing to optimal dimensions for background display
3. Optimizing file size
"""

from PIL import Image
import os

def optimize_david_image():
    input_path = 'bizley/assets/images/David.png'
    output_path = 'bizley/assets/images/David_optimized.png'
    backup_path = 'bizley/assets/images/David_original.png'
    
    # Open the image
    img = Image.open(input_path)
    print(f"Original size: {img.size}")
    
    # Backup original
    if not os.path.exists(backup_path):
        img.save(backup_path, quality=95)
        print(f"Backed up original to {backup_path}")
    
    # Current image is 800x1599 (aspect ratio ~1:2)
    # Panel displays at various widths but typically 70% width when active
    # Target aspect ratio closer to 3:4 or 2:3 for better panel fit
    
    width, height = img.size
    
    # Calculate optimal crop - take center-weighted crop
    # Keep full width but reduce height to create better aspect ratio
    target_aspect = 3/4  # 0.75
    target_height = int(width / target_aspect)
    
    if target_height < height:
        # Crop from top and bottom, keeping center
        # But weight slightly towards top for portrait photos
        crop_top = int((height - target_height) * 0.3)  # 30% from top
        crop_bottom = crop_top + target_height
        
        img_cropped = img.crop((0, crop_top, width, crop_bottom))
        print(f"Cropped to: {img_cropped.size} (removed {height - target_height}px height)")
    else:
        img_cropped = img
    
    # Resize to optimal display size (1200px width is good for high-DPI displays)
    target_width = 1200
    aspect = img_cropped.size[1] / img_cropped.size[0]
    target_height = int(target_width * aspect)
    
    img_resized = img_cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    print(f"Resized to: {img_resized.size}")
    
    # Save optimized version
    img_resized.save(output_path, 'PNG', optimize=True)
    print(f"Saved optimized image to {output_path}")
    
    # Get file sizes
    original_size = os.path.getsize(input_path) / 1024
    optimized_size = os.path.getsize(output_path) / 1024
    print(f"\nFile size: {original_size:.1f}KB → {optimized_size:.1f}KB ({optimized_size/original_size*100:.1f}%)")
    
    return output_path

if __name__ == '__main__':
    optimize_david_image()
    print("\nReview the optimized image. If satisfied, you can:")
    print("1. Replace David.png with David_optimized.png")
    print("2. Or keep both and update the code to use David_optimized.png")
