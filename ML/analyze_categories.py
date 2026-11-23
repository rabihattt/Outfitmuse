
import pandas as pd

csv_path = "../clothing dataset/images.csv"

df = pd.read_csv(csv_path)

print("TOTAL IMAGES:", len(df))

print("\nCATEGORY DISTRIBUTION:")

counts = df["label"].value_counts()

for category, count in counts.items():
    percentage = (count / len(df)) * 100

    print(
        f"{category:15} "
        f"{count:5} images "
        f"({percentage:.2f}%)"
    )

print("\nTOTAL UNIQUE CATEGORIES:", df["label"].nunique())
