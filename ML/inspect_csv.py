
import pandas as pd

csv_path = "../clothing dataset/images.csv"

df = pd.read_csv(csv_path)

print("Total Rows:", len(df))

print("\nColumns:")
print(df.columns.tolist())

print("\nCategory Distribution:")
print(df["label"].value_counts())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Image IDs:")
print(df["image"].duplicated().sum())

print("\nSample Data:")
print(df.head(10))
