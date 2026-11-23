
import os
from collections import Counter
from PIL import Image

DATASET_DIR = "../prepared_dataset"

total = 0
corrupted = []
dimensions = Counter()
modes = Counter()
formats = Counter()

for split in ["train", "val", "test"]:
    split_path = os.path.join(DATASET_DIR, split)

    for category in os.listdir(split_path):
        category_path = os.path.join(split_path, category)

        if not os.path.isdir(category_path):
            continue

        for filename in os.listdir(category_path):
            filepath = os.path.join(category_path, filename)

            try:
                with Image.open(filepath) as img:
                    img.verify()

                # Reopen after verify to inspect metadata
                with Image.open(filepath) as img:
                    dimensions[img.size] += 1
                    modes[img.mode] += 1
                    formats[img.format] += 1

                total += 1

            except Exception as e:
                corrupted.append((filepath, str(e)))

print("\n========== IMAGE VERIFICATION ==========")
print("Total valid images:", total)
print("Corrupted images:", len(corrupted))

print("\nIMAGE DIMENSIONS:")
for size, count in dimensions.most_common(10):
    print(size, ":", count)

print("\nIMAGE MODES:")
for mode, count in modes.items():
    print(mode, ":", count)

print("\nIMAGE FORMATS:")
for fmt, count in formats.items():
    print(fmt, ":", count)

if corrupted:
    print("\nCORRUPTED FILES:")
    for filepath, error in corrupted[:20]:
        print(filepath, error)

print("\nVerification completed!")
