import pandas as pd


def analyze_data(df):

    # Create a copy so the original uploaded data is not modified
    df = df.copy()

    # Store original record count before cleaning
    original_records = len(df)

    # -----------------------------
    # DATA TYPE CLEANING
    # -----------------------------

    # Convert age to numeric.
    # Invalid text values become NaN.
    if "age" in df.columns:
        df["age"] = pd.to_numeric(df["age"], errors="coerce")

    # -----------------------------
    # DATA QUALITY CHECKS
    # -----------------------------

    # Missing values
    missing_values = int(df.isnull().sum().sum())

    # Duplicate customers
    if "email" in df.columns:
        duplicate_customers = df[
            df["email"].notna()
            & df.duplicated(subset=["email"], keep=False)
        ]

        duplicate_records = int(duplicate_customers.shape[0])
    else:
        duplicate_records = 0

    # Invalid ages
    if "age" in df.columns:
        invalid_age = (
            (df["age"] < 0)
            | (df["age"] > 120)
        )

        invalid_age_records = int(invalid_age.sum())
    else:
        invalid_age = pd.Series(False, index=df.index)
        invalid_age_records = 0

    # Invalid emails
    if "email" in df.columns:
        invalid_email = (
            df["email"].notna()
            & (
                ~df["email"].str.contains("@", na=False)
                | ~df["email"].str.contains(r"\.", na=False)
            )
        )

        invalid_email_records = int(invalid_email.sum())
    else:
        invalid_email = pd.Series(False, index=df.index)
        invalid_email_records = 0

    # -----------------------------
    # DATA CLEANING
    # -----------------------------

    # Standardize city names
    if "city" in df.columns:
        df["city"] = (
            df["city"]
            .astype("string")
            .str.strip()
            .str.title()
        )

    # Remove duplicate email records
    if "email" in df.columns:
        df = df[
            df["email"].isna()
            | ~df.duplicated(
                subset=["email"],
                keep="first"
            )
        ]

    # Replace invalid ages with missing values
    if "age" in df.columns:
        df.loc[invalid_age, "age"] = None

    # Replace invalid emails with missing values
    if "email" in df.columns:
        df.loc[invalid_email, "email"] = None

    # -----------------------------
    # QUALITY SCORE
    # -----------------------------

    total_issues = (
        missing_values
        + duplicate_records
        + invalid_age_records
        + invalid_email_records
    )

    if original_records > 0:
        quality_score = max(
            0,
            100 - (
                total_issues
                / original_records
                * 100
            )
        )
    else:
        quality_score = 0

    # -----------------------------
    # QUALITY REPORT
    # -----------------------------

    quality_report = {
        "total_records": original_records,
        "missing_values": missing_values,
        "duplicate_records": duplicate_records,
        "invalid_age_records": invalid_age_records,
        "invalid_email_records": invalid_email_records,
        "quality_score": round(quality_score, 2)
    }

    return quality_report, df