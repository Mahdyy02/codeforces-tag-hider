#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    """Create a simple icon with gradient background and eye symbol"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    margin = size // 8
    radius = size // 4
    
    # Draw rounded rectangle background with blue color
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=radius,
        fill=(59, 130, 246, 255)  # Blue color
    )
    
    # Draw eye shape (simplified)
    center_x = size // 2
    center_y = size // 2
    eye_width = size // 2
    eye_height = size // 3
    
    # Outer eye shape (ellipse)
    eye_bbox = [
        center_x - eye_width//2,
        center_y - eye_height//2,
        center_x + eye_width//2,
        center_y + eye_height//2
    ]
    draw.ellipse(eye_bbox, fill=(255, 255, 255, 230))
    
    # Pupil
    pupil_radius = size // 8
    pupil_bbox = [
        center_x - pupil_radius,
        center_y - pupil_radius,
        center_x + pupil_radius,
        center_y + pupil_radius
    ]
    draw.ellipse(pupil_bbox, fill=(30, 58, 138, 255))  # Dark blue
    
    # Inner pupil highlight
    highlight_radius = size // 16
    highlight_bbox = [
        center_x - highlight_radius,
        center_y - highlight_radius,
        center_x + highlight_radius,
        center_y + highlight_radius
    ]
    draw.ellipse(highlight_bbox, fill=(147, 197, 253, 200))  # Light blue
    
    # Add lock symbol overlay (small padlock)
    lock_size = size // 4
    lock_x = center_x + eye_width // 3
    lock_y = center_y + eye_height // 3
    
    # Lock body
    lock_body = [
        lock_x - lock_size//4,
        lock_y,
        lock_x + lock_size//4,
        lock_y + lock_size//2
    ]
    draw.rounded_rectangle(lock_body, radius=lock_size//8, fill=(255, 255, 255, 240))
    
    # Lock shackle
    shackle_width = lock_size // 3
    shackle_height = lock_size // 3
    draw.arc(
        [lock_x - shackle_width//2, lock_y - shackle_height, 
         lock_x + shackle_width//2, lock_y],
        start=0, end=180,
        fill=(255, 255, 255, 240),
        width=max(2, size//32)
    )
    
    # Save image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Generate icons in different sizes
sizes = {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
}

for size, filename in sizes.items():
    create_icon(size, filename)

print("\nAll icons created successfully!")
print("Icons are located in the 'icons' folder.")