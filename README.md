🩺 DataMedic AI — Intelligent Data Quality & Cleaning Assistant

DataMedic AI is an AI-assisted Data Engineering and Data Quality platform that helps identify, analyze, clean, transform, and store raw customer data through an interactive web dashboard.

The application combines Python, Pandas, FastAPI, React, MySQL, and Gemini AI to create an end-to-end data-quality and ETL workflow.

It automatically detects common data-quality issues, generates a quality report, prepares cleaned records, loads transformed data into MySQL, and uses Gemini AI to provide human-readable explanations and recommendations.

📌 Project Overview

Real-world datasets often contain data-quality problems such as:

Missing values

Duplicate customer records

Invalid numerical values

Invalid email addresses

Inconsistent text formatting

Unstandardized data

DataMedic AI automates the initial data-quality process through a web-based dashboard.

Complete Workflow

Raw Customer CSV
       ↓
React Dashboard
       ↓
FastAPI Backend
       ↓
Python + Pandas
       ↓
Data Quality Analysis
       ↓
Data Cleaning & Standardization
       ↓
Quality Report
       ↓
Cleaned Dataset
       ↓
MySQL Database
       ↓
Gemini AI Analysis
       ↓
AI Explanation & Recommendations

🎯 Problem Statement

Poor-quality data can lead to:

Incorrect analytics

Duplicate customer information

Incorrect business reports

Invalid calculations

Database inconsistencies

Unreliable decision-making

For example, a customer record containing an invalid age, missing email, or duplicate email address should be identified before the data is used for further processing.

DataMedic AI provides an automated workflow to detect these problems, clean the dataset, and prepare reliable records for database storage.

✨ Features

🔍 Automated Data Quality Analysis

The application analyzes uploaded CSV datasets for:

Missing values

Duplicate customer records

Invalid ages

Invalid email formats

Inconsistent city formatting

The detected issues are presented through the interactive dashboard.

🧹 Data Cleaning & Standardization

DataMedic AI prepares a cleaned version of the uploaded dataset.

The cleaning process includes:

Removing duplicate records

Standardizing city names

Handling invalid age values

Handling invalid email values

Preparing transformed records for database loading

The cleaned dataset can also be downloaded as:

cleaned_customers.csv

📊 Data Quality Report

The backend generates a quality report containing metrics such as:

{
    "total_records": 10,
    "missing_values": 3,
    "duplicate_records": 2,
    "invalid_age_records": 2,
    "invalid_email_records": 1,
    "quality_score": 20.0
}

The values above represent the current sample dataset. Actual values change depending on the uploaded dataset.

The dashboard presents these metrics through:

Quality statistics

Quality score

Detected issue summaries

Detailed analysis results

Cleaned record information

🗂️ Dataset Records

The Dataset Records section displays customer records from the uploaded dataset.

It provides:

Search by ID, name, or email

City filtering

Pagination

Customer record viewing

Structured customer information

Displayed fields include:

ID

Customer

Age

City

Email

🧹 Cleaned Data

The Cleaned Data section displays the records produced by the data-cleaning process.

It provides:

Search

City filtering

Pagination

Customer details

Cleaned-record preview

CSV download

This allows users to inspect the transformed dataset before loading it into the database or using it downstream.

🔄 ETL Pipeline

DataMedic AI provides an interactive ETL pipeline showing the major processing stages:

01  CSV Input
       ↓
02  Quality Analysis
       ↓
03  Data Cleaning
       ↓
04  MySQL Load
       ↓
05  AI Insights

The dashboard visually indicates the progress of the different processing stages during the current session.

🗄️ MySQL Integration

Cleaned customer records can be loaded into a MySQL database directly through the DataMedic AI dashboard.

Example database structure:

datamedic
└── customers

The MySQL database provides persistent storage for the transformed customer data.

The project uses:

mysql-connector-python

for Python-to-MySQL connectivity.

🤖 Gemini AI Integration

After the data-quality analysis is completed, DataMedic AI sends the generated quality report to Gemini AI.

Gemini provides:

A short explanation of detected problems

Why the problems matter

Recommended actions for a Data Engineer

An overall assessment of the dataset

The AI acts as an interpretation layer rather than replacing the deterministic data-quality rules.

Architecture Principle

Deterministic Processing
        ↓
Python + Pandas
        ↓
Data Quality Report
        ↓
AI Interpretation
        ↓
Gemini
        ↓
Explanation & Recommendations

This separation keeps the core data-quality process predictable while using Generative AI for natural-language analysis.

🏗️ System Architecture

                        DataMedic AI
                             │
                             ▼
                   ┌──────────────────┐
                   │ React Frontend   │
                   │ Web Dashboard    │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ FastAPI Backend  │
                   │ REST API         │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Python + Pandas  │
                   │ Data Processing  │
                   └────────┬─────────┘
                            │
                            ▼
             ┌──────────────────────────────┐
             │      Data Quality Checks     │
             │                              │
             │ • Missing Values             │
             │ • Duplicate Customers        │
             │ • Invalid Ages               │
             │ • Invalid Emails             │
             │ • City Formatting             │
             └──────────────┬───────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Data Cleaning &  │
                   │ Standardization  │
                   └────────┬─────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌─────────────────┐   ┌────────────────┐
        │ Quality Report  │   │ MySQL Database │
        │      JSON       │   │   Customers    │
        └────────┬────────┘   └────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │    Gemini API   │
        │    AI Analysis  │
        └────────┬────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ AI Explanation    │
        │ & Recommendations │
        └───────────────────┘

🛠️ Technology Stack

Technology

Purpose

Python

Core backend programming language

Pandas

Data processing, validation, and transformation

FastAPI

Backend REST API

React

Interactive frontend dashboard

Vite

Frontend development and build tooling

MySQL

Relational database storage

MySQL Connector/Python

Python-to-MySQL connectivity

Gemini API

AI-powered data-quality analysis

Google GenAI SDK

Gemini API integration

python-dotenv

Environment variable management

JSON

Quality report generation

Lucide React

Frontend icons

Recharts

Data-quality visualization

📂 Project Structure

datamedic-ai/
│
├── .gitignore
├── README.md
├── requirements.txt
│
├── customers.csv
│
├── llm_assistant.py
├── load_mysql.py
│
├── backend/
│   ├── main.py
│   ├── database.py
│   └── data_quality.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── eslint.config.js
│
└── ...

Important Files

File / Folder

Description

backend/main.py

FastAPI backend and API endpoints

backend/data_quality.py

Data-quality analysis and cleaning logic

llm_assistant.py

Gemini API integration and AI analysis

load_mysql.py

MySQL data-loading functionality

customers.csv

Sample customer dataset

frontend/

React/Vite dashboard

requirements.txt

Python backend dependencies

.gitignore

Prevents sensitive and unnecessary files from being committed

🔎 Data Quality Rules

1. Missing Values

The pipeline identifies missing values using Pandas:

df.isnull().sum()

This helps identify incomplete customer records.

2. Duplicate Customers

Customer records are checked for duplicate email addresses:

df.duplicated(subset=["email"], keep=False)

This helps identify multiple records that may represent the same customer.

Null email values are excluded from duplicate-email detection.

3. Invalid Ages

The project considers ages outside the range of 0–120 invalid.

(df["age"] < 0) | (df["age"] > 120)

Invalid age values are identified during quality analysis and converted to missing values during the cleaning stage.

4. Invalid Emails

A basic email validation rule checks whether non-null email values contain:

@
.

For example:

ravi@gmail

is identified as an invalid email value.

Invalid email values are converted to missing values during the cleaning stage.

5. City Standardization

City values are standardized using:

df["city"] = (
    df["city"]
    .str.strip()
    .str.title()
)

For example:

CHENNAI
 Chennai
chennai

are standardized to:

Chennai

📊 Example Data Flow

Example Input

ID: 7
Name: Suresh
Age: -5
City: Madurai
Email: suresh@gmail.com

The quality engine identifies:

Invalid age

During the cleaning stage, the invalid age is converted to a missing value.

Similarly, inconsistent city formatting such as:

" Chennai"
"CHENNAI"
"chennai"

is standardized to:

"Chennai"

🌐 Backend API

DataMedic AI exposes the following FastAPI endpoints:

Method

Endpoint

Purpose

GET

/

API health/root response

POST

/analyze

Analyze uploaded CSV and return quality results

POST

/ai-insights

Generate Gemini AI analysis

POST

/clean

Generate/download cleaned CSV

POST

/load

Load cleaned records into MySQL

The React frontend communicates with these endpoints to perform the complete data-quality workflow.

FastAPI also provides interactive API documentation through:

/docs

⚙️ Installation

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL

Move into the project directory:

cd datamedic-ai

2. Create a Python Virtual Environment

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

3. Install Backend Dependencies

pip install -r requirements.txt

🔐 Environment Variables

Create a .env file in the project root:

GEMINI_API_KEY=your_gemini_api_key

MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=datamedic

The .env file contains sensitive credentials and should never be committed to GitHub.

The project .gitignore prevents the file from being tracked.

🗄️ MySQL Setup

Create the database:

CREATE DATABASE datamedic;

Select the database:

USE datamedic;

Create the customers table according to the columns used by the project.

Example structure:

customers
├── id
├── name
├── email
├── age
└── city

Make sure the MySQL server is running before loading data.

▶️ Running the Backend

From the project root, move into the backend directory:

cd backend

Start the FastAPI application:

uvicorn main:app --reload

The API will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

▶️ Running the Frontend

Open another terminal and move into the frontend directory:

cd frontend

Install the frontend dependencies:

npm install

Start the Vite development server:

npm run dev

The React dashboard will then be available through the local URL provided by Vite.

🔄 Application Workflow

The complete application workflow is:

1. Upload CSV
       ↓
2. Analyze Dataset
       ↓
3. Detect Data Quality Issues
       ↓
4. Generate Quality Report
       ↓
5. Clean & Standardize Data
       ↓
6. View Cleaned Records
       ↓
7. Download Cleaned CSV
       ↓
8. Load Cleaned Data into MySQL
       ↓
9. Generate Gemini AI Insights

🤖 AI Analysis

After data-quality analysis is completed, DataMedic AI sends the generated quality report to Gemini.

The AI receives information about:

Missing values

Duplicate records

Invalid ages

Invalid emails

Quality score

Gemini then provides:

Explanation
     ↓
Why the issues matter
     ↓
Recommended actions
     ↓
Overall dataset assessment

The deterministic quality engine remains responsible for identifying the actual data-quality issues.

Gemini is used to interpret the results and provide human-readable recommendations.

🗄️ MySQL Data Pipeline

The cleaned records are prepared for MySQL storage.

The pipeline performs transformations such as:

Reading the customer dataset
        ↓
Detecting data-quality problems
        ↓
Cleaning invalid values
        ↓
Removing duplicate email records
        ↓
Standardizing city names
        ↓
Preparing transformed records
        ↓
Connecting to MySQL
        ↓
Loading cleaned records into the customers table

Example SQL Query

SELECT * FROM customers;

Count the Loaded Records

SELECT COUNT(*)
FROM customers;

Group Records by City

SELECT city, COUNT(*)
FROM customers
GROUP BY city;

View Customer Information

SELECT name, city
FROM customers;

📈 Example Quality Analysis

For the included sample dataset, the quality engine identifies issues such as:

Total records: 10
Missing values: 3
Duplicate records: 2
Invalid ages: 2
Invalid emails: 1
Quality Score: 20.0%

The pipeline then cleans the dataset by:

Removing duplicate email records
        ↓
Converting invalid ages to missing values
        ↓
Converting invalid emails to missing values
        ↓
Standardizing city names
        ↓
Preparing cleaned records

The cleaned dataset contains 9 records after duplicate removal.

🔒 Security

Sensitive credentials are stored using environment variables rather than being hard-coded in Python.

The following files and directories should not be committed:

.env
*.db
__pycache__/
*.pyc
.venv/
venv/
.vscode/
node_modules/
sample_quality_report.json

Never publish an API key in source code or GitHub.

If an API key is accidentally committed, revoke it and generate a new key.

🎓 Data Engineering Concepts Demonstrated

DataMedic AI demonstrates practical Data Engineering and ETL concepts including:

Data ingestion

Data validation

Data quality assessment

Data cleaning

Data transformation

Duplicate detection

Missing-value detection

Data standardization

ETL pipeline design

Relational database integration

SQL analysis

JSON reporting

REST API development

API integration

LLM integration

Error handling

Environment-based configuration

🚀 Future Improvements

Potential future enhancements include:

Support for Excel and JSON input files

Automated scheduled data pipelines

Additional data-quality rules

Data lineage tracking

Structured logging

PostgreSQL support

Apache Airflow integration

PySpark-based processing for larger datasets

Cloud storage integration

Data warehouse integration

Automated anomaly detection

Advanced AI-assisted data-quality recommendations

🎯 Project Goal

The goal of DataMedic AI is to demonstrate how practical Data Engineering and ETL techniques can be combined with Generative AI to create an intelligent data-quality workflow.

The core processing remains deterministic:

Python
   +
Pandas
   +
ETL
   +
MySQL

Gemini provides an additional natural-language intelligence layer:

Data Quality Report
        ↓
      Gemini
        ↓
Explanation + Recommendations

This architecture combines reliable data processing with AI-assisted interpretation while keeping the core data-quality rules deterministic and predictable.

👨‍💻 Author

Joshua Daniel

Aspiring Data Engineer

Core Technologies

Python • SQL • Pandas • FastAPI • MySQL
ETL • Data Quality • Gemini AI • React

⭐ Project Highlights

End-to-end Data Quality and ETL workflow

Python and Pandas-based data processing

FastAPI REST backend

Interactive React dashboard

MySQL database integration

Gemini AI interpretation layer

Automated data cleaning and standardization

Quality report generation

Cleaned CSV export

Practical Data Engineering architecture