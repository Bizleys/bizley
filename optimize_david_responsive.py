"""
Optimize and generate responsive variants for David.jpg
Creates multiple sizes optimized for CSS background-image usage
"""

from PIL import Image
import os

def optimize_and_generate_responsive_david():
    input_path = 'bizley/assets/images/David.jpg'
    output_dir = 'bizley/assets/images'
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Open the image
    img = Image.open(input_path)
    print(f"Original size: {img.size} ({img.size[0]}x{img.size[1]})")
    original_size = os.path.getsize(input_path) / 1024
    print(f"Original file size: {original_size:.1f}KB\n")
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Target widths for responsive backgrounds
    # These match common panel widths and breakpoints
    widths = [480, 768, 1200, 1600]
    
    results = []
    
    for width in widths:
        # Calculate height maintaining aspect ratio
        aspect_ratio = img.size[1] / img.size[0]
        height = int(width * aspect_ratio)
        
        # Resize image
        resized = img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Save as optimized JPEG
        jpeg_path = os.path.join(output_dir, f'David-{width}.jpg')
        resized.save(jpeg_path, 'JPEG', quality=85, optimize=True)
        jpeg_size = os.path.getsize(jpeg_path) / 1024
        
        # Save as WebP for modern browsers
        webp_path = os.path.join(output_dir, f'David-{width}.webp')
        resized.save(webp_path, 'WEBP', quality=85, method=6)
        webp_size = os.path.getsize(webp_path) / 1024
        
        results.append({
            'width': width,
            'height': height,
            'jpeg_size': jpeg_size,
            'webp_size': webp_size
        })
        
        print(f"Generated {width}w:")
        print(f"  JPEG: {jpeg_path} ({jpeg_size:.1f}KB)")
        print(f"  WebP: {webp_path} ({webp_size:.1f}KB)")
    
    # Optimize the original at its current size if larger than max width
    if img.size[0] > max(widths):
        optimized_path = os.path.join(output_dir, 'David.jpg')
        
        # Create a backup first
        backup_path = os.path.join(output_dir, 'David-original.jpg')
        if not os.path.exists(backup_path):
            img.save(backup_path, 'JPEG', quality=95)
            print(f"\nBacked up original to: {backup_path}")
        
        # Save optimized version at original dimensions
        img.save(optimized_path, 'JPEG', quality=85, optimize=True)
        optimized_size = os.path.getsize(optimized_path) / 1024
        print(f"\nOptimized original:")
        print(f"  {optimized_path} ({optimized_size:.1f}KB)")
        print(f"  Savings: {original_size - optimized_size:.1f}KB ({(original_size - optimized_size)/original_size*100:.1f}%)")
    
    print("\n" + "="*60)
    print("SUMMARY - Responsive variants generated:")
    print("="*60)
    for r in results:
        savings = r['jpeg_size'] - r['webp_size']
        print(f"{r['width']:4d}w ({r['height']:4d}h): JPEG {r['jpeg_size']:6.1f}KB | WebP {r['webp_size']:6.1f}KB (saves {savings:.1f}KB)")
    
    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("Update bizley/style.css to use image-set() with these variants:")
    print("Example for David's section:")
    print("""
.menu-section[data-name="David"] {
    background-image: -webkit-image-set(
        url('assets/images/David-480.webp') 1x,
        url('assets/images/David-768.webp') 2x
    );
    background-image: image-set(
        url('assets/images/David-480.webp') 1x,
        url('assets/images/David-768.webp') 2x,
        url('assets/images/David-480.jpg') 1x,
        url('assets/images/David-768.jpg') 2x
    );
}

@media (min-width: 768px) {
    .menu-section[data-name="David"] {
        background-image: -webkit-image-set(
            url('assets/images/David-768.webp') 1x,
            url('assets/images/David-1200.webp') 2x
        );
        background-image: image-set(
            url('assets/images/David-768.webp') 1x,
            url('assets/images/David-1200.webp') 2x,
            url('assets/images/David-768.jpg') 1x,
            url('assets/images/David-1200.jpg') 2x
        );
    }
}
""")

if __name__ == '__main__':
    optimize_and_generate_responsive_david()
