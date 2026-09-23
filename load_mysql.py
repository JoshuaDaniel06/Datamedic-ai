import pandas as pd
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

df = pd.read_csv("customers.csv")

print("CSV file loaded successfully!")


df = df[
    df["email"].isna() |
    ~df.duplicated(subset=["email"], keep="first")]


df["city"] = df["city"].str.strip().str.title()


invalid_age_mask = (
    (df["age"] < 0) |
    (df["age"] > 120)
)

df.loc[invalid_age_mask, "age"] = None

invalid_email_mask = (
    df["email"].notna() &
    (
        ~df["email"].str.contains("@", na=False) |
        ~df["email"].str.contains(r"\.", na=False)
    )
)

df.loc[invalid_email_mask, "email"] = None

print("\nData transformed successfully!")





connection = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST"),
    user=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    database=os.getenv("MYSQL_DATABASE")
)

cursor = connection.cursor()


cursor.execute("TRUNCATE TABLE customers")


for _, row in df.iterrows():

    cursor.execute("""
        INSERT INTO customers
        (id, name, email, age, city)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        row["id"],
        row["name"],
        row["email"] if pd.notna(row["email"]) else None,
        row["age"] if pd.notna(row["age"]) else None,
        row["city"]
    ))

connection.commit()

cursor.close()
connection.close()

print("\nCleaned data successfully loaded into MySQL!")