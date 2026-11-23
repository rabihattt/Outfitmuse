
import os
from PIL import Image

base_path = "../clothing dataset/images"

folders = ["images_original", "images_compressed"]

for folder in folders:

    folder_path = os.path.join(base_path, folder)

    files = [
        f for f in os.listdir(folder_path)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    print(f"\n{folder.upper()}")
    print("Total Images:", len(files))

    if files:
        image_path = os.path.join(folder_path, files[0])

        img = Image.open(image_path)

        print("Sample Image:", files[0])
        print("Image Size:", img.size)
        print("Image Format:", img.format)
