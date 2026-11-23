
import pandas as pd
import shutil
from pathlib import Path
from sklearn.model_selection import GroupShuffleSplit

# ==========================================
# 1. PATH CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

CSV_PATH = BASE_DIR / "clothing dataset" / "images.csv"

IMAGE_DIR = (
    BASE_DIR
    / "clothing dataset"
    / "images"
    / "images_compressed"
)

OUTPUT_DIR = BASE_DIR / "prepared_dataset"


# ==========================================
# 2. SELECTED CATEGORIES
# ==========================================

SELECTED_CATEGORIES = [
    "T-Shirt",
    "Longsleeve",
    "Pants",
    "Shoes",
    "Shirt",
    "Dress",
    "Outwear",
    "Shorts",
    "Hat",
    "Skirt",
    "Polo",
    "Undershirt",
    "Blazer",
    "Hoodie"
]


# ==========================================
# 3. LOAD DATASET
# ==========================================

print("\nLoading dataset...")

if not CSV_PATH.exists():
    raise FileNotFoundError(f"CSV not found: {CSV_PATH}")

if not IMAGE_DIR.exists():
    raise FileNotFoundError(f"Image folder not found: {IMAGE_DIR}")

df = pd.read_csv(CSV_PATH)

# Keep adult clothing only
df = df[df["kids"] == False].copy()

# Keep selected categories
df = df[
    df["label"].isin(SELECTED_CATEGORIES)
].copy()

print("Selected records:", len(df))
print("Selected categories:", df["label"].nunique())


# ==========================================
# 4. IMAGE MATCHING
# ==========================================

print("\nChecking image files...")

image_map = {
    file.stem: file
    for file in IMAGE_DIR.iterdir()
    if file.is_file()
    and file.suffix.lower() in [".jpg", ".jpeg", ".png"]
}

df["image_path"] = df["image"].astype(str).map(image_map)

missing_images = df["image_path"].isna().sum()

print("Missing images:", missing_images)

df = df.dropna(subset=["image_path"]).copy()

print("Valid image records:", len(df))

if len(df) == 0:
    raise ValueError("No valid images found!")

# Check that all selected categories exist
missing_categories = (
    set(SELECTED_CATEGORIES) - set(df["label"].unique())
)

if missing_categories:
    raise ValueError(
        f"Missing categories: {missing_categories}"
    )


# ==========================================
# 5. OPTIMIZED GROUP-BASED SPLITTING
# ==========================================

print("\nSearching for balanced sender-based splits...")

target_ratios = {
    "train": 0.70,
    "val": 0.15,
    "test": 0.15
}

overall_distribution = (
    df["label"].value_counts(normalize=True)
)

best_score = float("inf")
best_splits = None

TOTAL_ATTEMPTS = 500

for seed in range(TOTAL_ATTEMPTS):

    # First split: Train 70%, Temporary 30%
    splitter1 = GroupShuffleSplit(
        n_splits=1,
        test_size=0.30,
        random_state=seed
    )

    train_idx, temp_idx = next(
        splitter1.split(
            df,
            groups=df["sender_id"]
        )
    )

    train_candidate = df.iloc[train_idx]
    temp_candidate = df.iloc[temp_idx]

    # Second split: Validation 15%, Test 15%
    splitter2 = GroupShuffleSplit(
        n_splits=1,
        test_size=0.50,
        random_state=seed + 10000
    )

    val_idx, test_idx = next(
        splitter2.split(
            temp_candidate,
            groups=temp_candidate["sender_id"]
        )
    )

    val_candidate = temp_candidate.iloc[val_idx]
    test_candidate = temp_candidate.iloc[test_idx]

    candidates = {
        "train": train_candidate,
        "val": val_candidate,
        "test": test_candidate
    }

    size_error = 0
    category_error = 0
    missing_penalty = 0
    minimum_count_penalty = 0

    for name, part in candidates.items():

        # Split size difference
        actual_ratio = len(part) / len(df)

        size_error += abs(
            actual_ratio - target_ratios[name]
        )

        # Category distribution
        distribution = (
            part["label"].value_counts(normalize=True)
        )

        counts = part["label"].value_counts()

        for category in SELECTED_CATEGORIES:

            actual = distribution.get(category, 0)

            expected = overall_distribution.get(
                category, 0
            )

            category_error += abs(actual - expected)

            # Penalize missing categories
            if category not in counts.index:
                missing_penalty += 1

            # Encourage sufficient samples
            minimum_required = (
                10 if name == "train" else 5
            )

            actual_count = counts.get(category, 0)

            if actual_count < minimum_required:
                minimum_count_penalty += (
                    minimum_required - actual_count
                )

    # Combined optimization score
    score = (
        size_error * 10
        + category_error * 3
        + missing_penalty * 5
        + minimum_count_penalty * 0.05
    )

    if score < best_score:

        best_score = score

        best_splits = {
            "train": train_candidate.copy(),
            "val": val_candidate.copy(),
            "test": test_candidate.copy()
        }

    if (seed + 1) % 100 == 0:
        print(
            f"Checked {seed + 1}/{TOTAL_ATTEMPTS} "
            f"splits | Best score: {best_score:.4f}"
        )


# Select best split
train_df = best_splits["train"]
val_df = best_splits["val"]
test_df = best_splits["test"]

splits = {
    "train": train_df,
    "val": val_df,
    "test": test_df
}

print("\nBest split selected!")
print("Best score:", round(best_score, 4))


# ==========================================
# 6. DATA LEAKAGE CHECK
# ==========================================

print("\nChecking sender leakage...")

train_senders = set(train_df["sender_id"])
val_senders = set(val_df["sender_id"])
test_senders = set(test_df["sender_id"])

assert train_senders.isdisjoint(val_senders)
assert train_senders.isdisjoint(test_senders)
assert val_senders.isdisjoint(test_senders)

print("Sender leakage check: PASSED")


# ==========================================
# 7. OUTPUT DIRECTORY CHECK
# ==========================================

if OUTPUT_DIR.exists():

    raise FileExistsError(
        f"\nOutput folder already exists: {OUTPUT_DIR}\n"
        "Remove the old prepared_dataset folder "
        "before running again."
    )


# ==========================================
# 8. CREATE DATASET FOLDERS
# ==========================================

print("\nCreating dataset folders...")

for split_name, split_df in splits.items():

    for _, row in split_df.iterrows():

        category = row["label"]

        source = Path(row["image_path"])

        destination_dir = (
            OUTPUT_DIR / split_name / category
        )

        destination_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        destination = destination_dir / source.name

        shutil.copy2(source, destination)


# ==========================================
# 9. FINAL DATASET REPORT
# ==========================================

print("\n========== FINAL DATASET REPORT ==========")

for split_name, split_df in splits.items():

    percentage = (
        len(split_df) / len(df)
    ) * 100

    print(f"\n{split_name.upper()}")

    print("Images:", len(split_df))

    print(
        "Percentage:",
        round(percentage, 2), "%"
    )

    print(
        "Unique Senders:",
        split_df["sender_id"].nunique()
    )

    print("\nCategory Distribution:")

    category_counts = (
        split_df["label"]
        .value_counts()
        .reindex(SELECTED_CATEGORIES, fill_value=0)
    )

    print(category_counts)

    missing = category_counts[
        category_counts == 0
    ].index.tolist()

    if missing:
        print("WARNING: Missing categories:", missing)


# ==========================================
# 10. FINAL VERIFICATION
# ==========================================

print("\n========== FINAL VERIFICATION ==========")

print("Total valid images:", len(df))

print("Train images:", len(train_df))
print("Validation images:", len(val_df))
print("Test images:", len(test_df))

print(
    "Total split images:",
    len(train_df) + len(val_df) + len(test_df)
)

print(
    "Sender leakage:",
    "PASSED"
)

print(
    "All images accounted for:",
    len(train_df) + len(val_df) + len(test_df) == len(df)
)

print("\nDataset preparation completed!")

print("Output folder:", OUTPUT_DIR)
