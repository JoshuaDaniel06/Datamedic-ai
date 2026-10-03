from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

import json
from io import BytesIO, StringIO
import os

import mysql.connector
import pandas as pd
from dotenv import load_dotenv

from backend.data_quality import analyze_data
from llm_assistant import analyze_quality_report


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="DataMedic AI",
    description="AI-assisted Data Quality and ETL Pipeline",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://datamedic-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "DataMedic AI API is running"
    }


# ==========================================
# HELPER FUNCTIONS
# ==========================================

async def read_csv_file(file: UploadFile):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file.",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    try:
        df = pd.read_csv(BytesIO(contents))
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read CSV file: {error}",
        )

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="CSV file does not contain any records.",
        )

    return df


def dataframe_to_records(df: pd.DataFrame):
    """Convert a DataFrame into JSON-safe records for the React dashboard."""
    if df is None or df.empty:
        return []

    # to_json converts pandas/numpy scalar values safely and preserves nulls.
    return json.loads(
        df.to_json(
            orient="records",
            date_format="iso",
        )
    )


# ==========================================
# ANALYZE CSV
# ==========================================

@app.post("/analyze")
async def analyze_csv(
    file: UploadFile = File(...),
):
    df = await read_csv_file(file)

    try:
        quality_report, cleaned_df = analyze_data(df)

        return {
            "filename": file.filename,
            "quality_report": quality_report,
            "records": dataframe_to_records(df),
            "cleaned_records_data": dataframe_to_records(cleaned_df),
            "cleaned_records": len(cleaned_df),
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Data analysis failed: {error}",
        )


# ==========================================
# CLEAN CSV
# ==========================================

@app.post("/clean")
async def clean_csv(
    file: UploadFile = File(...),
):
    df = await read_csv_file(file)

    try:
        _, cleaned_df = analyze_data(df)

        csv_buffer = StringIO()
        cleaned_df.to_csv(csv_buffer, index=False)

        csv_bytes = BytesIO(
            csv_buffer.getvalue().encode("utf-8")
        )

        return StreamingResponse(
            csv_bytes,
            media_type="text/csv",
            headers={
                "Content-Disposition":
                "attachment; filename=cleaned_customers.csv"
            },
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Data cleaning failed: {error}",
        )


# ==========================================
# AI INSIGHTS
# ==========================================

@app.post("/ai-insights")
async def ai_insights(
    file: UploadFile = File(...),
):
    """
    The frontend sends the original CSV as multipart/form-data.
    This matches UploadFile = File(...) and fixes the previous 422 error.
    """
    df = await read_csv_file(file)

    try:
        quality_report, cleaned_df = analyze_data(df)

        ai_analysis = analyze_quality_report(
            quality_report
        )

        return {
            "filename": file.filename,
            "quality_report": quality_report,
            "cleaned_records": len(cleaned_df),
            "ai_analysis": ai_analysis,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {error}",
        )


# ==========================================
# MYSQL CONNECTION
# ==========================================

def get_mysql_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DATABASE", "datamedic"),
        )

        return connection

    except mysql.connector.Error as error:
        raise HTTPException(
            status_code=500,
            detail=f"MySQL connection failed: {error}",
        )


# ==========================================
# LOAD CLEANED DATA TO MYSQL
# ==========================================

@app.post("/load")
async def load_to_mysql(
    file: UploadFile = File(...),
):
    df = await read_csv_file(file)

    try:
        quality_report, cleaned_df = analyze_data(df)

        connection = get_mysql_connection()
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO customers
        (
            id,
            name,
            email,
            age,
            city
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s
        )
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            age = VALUES(age),
            city = VALUES(city)
        """

        records = []

        for _, row in cleaned_df.iterrows():
            customer_id = (
                int(row["id"])
                if pd.notna(row["id"])
                else None
            )

            name = (
                row["name"]
                if pd.notna(row["name"])
                else None
            )

            email = (
                row["email"]
                if pd.notna(row["email"])
                else None
            )

            age = (
                int(row["age"])
                if pd.notna(row["age"])
                else None
            )

            city = (
                row["city"]
                if pd.notna(row["city"])
                else None
            )

            records.append(
                (
                    customer_id,
                    name,
                    email,
                    age,
                    city,
                )
            )

        if records:
            cursor.executemany(insert_query, records)
            connection.commit()

        cursor.close()
        connection.close()

        return {
            "status": "success",
            "message": "Cleaned data successfully loaded into MySQL.",
            "records_loaded": len(records),
            "quality_report": quality_report,
        }

    except mysql.connector.Error as error:
        return {
            "status": "error",
            "message": f"MySQL error: {error}",
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"MySQL loading failed: {error}",
        )
