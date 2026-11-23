
import pandas as pd
from pathlib import Path

# Dataset paths
base_path = Path("../clothing dataset")

csv_path = base_path / "images.csv"

image_folders = [
    base_path / "images" / "images_original",
    base_path / "images" / "images_compressed"
]

# Read CSV
df = pd.read_csv(csv_path)

# Image IDs from CSV
csv_ids = set(df["image"].astype(str))

print("Total CSV Records:", len(csv_ids))

# Check both image folders
for folder in image_folders:

    image_files = [
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in
        [".jpg", ".jpeg", ".png"]
    ]

    image_ids = {f.stem for f in image_files}

    matched = csv_ids.intersection(image_ids)
    missing = csv_ids - image_ids
    extra = image_ids - csv_ids

    print("\n----------------------------")
    print("Folder:", folder.name)
    print("----------------------------")

    print("Total Image Files:", len(image_files))
    print("Matched Images:", len(matched))
    print("Missing Images:", len(missing))
    print("Extra Images:", len(extra))

    if missing:
        print("\nSample Missing IDs:")
        print(list(missing)[:5])
