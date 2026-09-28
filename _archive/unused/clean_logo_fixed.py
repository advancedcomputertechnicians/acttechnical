from PIL import Image, ImageChops
import os

def clean_logo(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return
        
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    # 1. Background Removal
    new_data = []
    for item in datas:
        # Transparent for white/nearly white
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)

    # 2. Trim Borders
    bbox = img.getbbox()
    if bbox:
        # The borders in the JPG are black lines.
        # We'll crop specifically to the content.
        cropped = img.crop(bbox)
        # Inner crop to shed the black box lines
        # (Assuming the black box is at the extreme edges)
        img = cropped.crop((5, 5, cropped.width - 5, cropped.height - 5))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Success: Saved to {output_path}")

if __name__ == "__main__":
    clean_logo("2010 02 17 act new symbol.jpg", "images/logo.png")
