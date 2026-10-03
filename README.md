🩺 DataMedic AI

AI-Assisted Data Quality & ETL Platform

DataMedic AI is an AI-assisted data quality and data engineering platform that helps identify, analyze, clean, transform, and store raw customer data through an interactive web dashboard.

The platform combines Python, Pandas, FastAPI, React, MySQL, and Gemini AI to create an end-to-end data-quality and ETL workflow.

It detects common data-quality issues, generates quality reports, cleans and standardizes records, loads transformed data into MySQL, and uses Gemini to provide human-readable explanations and recommendations.

🚀 Key Features

🔹 Data Engineering & ETL

Ingests raw customer data from CSV files

Performs data validation and transformation

Detects missing values and duplicate records

Identifies invalid ages and email addresses

Standardizes inconsistent city names

Generates an automated data-quality report

Produces a cleaned dataset

Loads cleaned customer data into MySQL

🔹 Data Quality Analysis

The platform analyzes datasets for:

Missing values

Duplicate customer records

Duplicate email addresses

Invalid age values

Invalid email formats

Inconsistent city formatting

The detected issues are presented through the interactive dashboard.

🔹 Data Cleaning & Standardization

The cleaning pipeline:

Removes duplicate customer records

Converts invalid ages to missing values

Converts invalid email values to missing values

Standardizes city names

Prepares transformed records for database loading

The cleaned dataset can be downloaded as:

cleaned_customers.csv

🔹 Quality Report

The application generates an automated JSON quality report containing metrics such as:

{
    "total_records": 10,
    "missing_values": 3,
    "duplicate_records": 2,
    "invalid_age_records": 2,
    "invalid_email_records": 1,
    "quality_score": 20.0
}

The actual values change depending on the uploaded dataset.

🔹 Interactive Dataset Dashboard

The React dashboard provides:

Dataset records

Customer search

Search by ID, name, or email

City filtering

Pagination

Cleaned-data preview

Quality statistics

Quality score

Detected issue summaries

CSV download

ETL pipeline status

MySQL loading

AI-generated insights

Error handling and processing feedback

🔹 MySQL Integration

Cleaned customer records can be loaded into MySQL directly through the application.

Cleaned Customer Data
        │
        ▼
      MySQL
        │
        ▼
 customers table

🔹 Gemini AI Analysis

Gemini is used as an interpretation layer after deterministic data-quality processing.

It provides:

Explanation of detected problems

Why the issues matter

Recommended actions

Overall dataset assessment

The core data-quality rules remain deterministic and are handled by Python and Pandas.

🏗️ System Architecture

                    ┌─────────────────────┐
                    │   Raw Customer CSV  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Dashboard   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │      REST API       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Python + Pandas   │
                    │   Data Processing   │
                    └──────────┬──────────┘
                               │
                               ▼
             ┌────────────────────────────────┐
             │       Data Quality Checks       │
             │                                │
             │ • Missing Values               │
             │ • Duplicate Records            │
             │ • Invalid Ages                 │
             │ • Invalid Emails               │
             │ • City Standardization         │
             └───────────────┬────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │ Data Cleaning &      │
                    │ Standardization     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │ Quality      │      │ MySQL        │
             │ Report JSON  │      │ Database     │
             └──────┬───────┘      └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │ Gemini API   │
             │ AI Analysis  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────────────┐
             │ AI Explanation &     │
             │ Recommendations      │
             └──────────────────────┘

🧠 AI Architecture

DataMedic AI separates deterministic data processing from generative AI interpretation.

Raw Dataset
     │
     ▼
Python + Pandas
     │
     ▼
Data Quality Rules
     │
     ├── Missing Values
     ├── Duplicate Detection
     ├── Age Validation
     ├── Email Validation
     └── City Standardization
     │
     ▼
Quality Report
     │
     ▼
Gemini AI
     │
     ▼
Explanation
     │
     ▼
Recommendations

This approach keeps the actual data-quality checks predictable while using Gemini for natural-language interpretation.

🛠️ Technology Stack

Backend

Python

FastAPI

Pandas

MySQL Connector/Python

python-dotenv

AI / GenAI

Google Gemini

Google GenAI SDK

AI-assisted data-quality interpretation

Frontend

React

Vite

Axios

Recharts

Lucide React

CSS

Database

MySQL

SQL

Relational data storage

Data Engineering

CSV ingestion

ETL pipelines

Data cleaning

Data validation

Data transformation

Data-quality reporting

Database loading

📁 Project Structure

datamedic-ai/

│
├── .env
├── .gitignore
├── README.md
├── requirements.txt
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

Purpose

backend/main.py

FastAPI backend and REST API endpoints

backend/data_quality.py

Data-quality analysis and cleaning logic

backend/database.py

Database connectivity and database operations

llm_assistant.py

Gemini API integration and AI analysis

load_mysql.py

Loads cleaned records into MySQL

customers.csv

Sample customer dataset

frontend/

React/Vite interactive dashboard

requirements.txt

Python backend dependencies

.gitignore

Prevents sensitive and unnecessary files from being committed

.env contains local credentials and should never be committed to GitHub.

node_modules should not be committed to GitHub. It can be recreated using npm install.

⚙️ How It Works

1. Data Ingestion

Raw customer information is loaded from a CSV dataset.

customers.csv
      │
      ▼
FastAPI / React
      │
      ▼
Data Processing

2. Data Quality Analysis

The quality engine checks the dataset for:

Raw Data
   │
   ├── Missing values
   ├── Duplicate records
   ├── Invalid ages
   ├── Invalid emails
   └── City formatting
          │
          ▼
   Quality Report

3. Data Cleaning

After identifying the issues, the cleaning pipeline transforms the data.

Quality Issues
      │
      ├── Remove duplicate records
      ├── Convert invalid ages
      ├── Convert invalid emails
      └── Standardize city names
             │
             ▼
      Clean Customer Data

4. Database Loading

The cleaned dataset is prepared for persistent storage.

Clean Customer Data
        │
        ▼
      MySQL
        │
        ▼
customers table

5. AI Interpretation

The quality report is passed to Gemini after deterministic processing.

Quality Report
      │
      ▼
   Gemini AI
      │
      ├── Explain detected issues
      ├── Explain why they matter
      ├── Recommend actions
      └── Assess the dataset

🔎 Data Quality Rules

Missing Values

Missing values are identified using Pandas:

df.isnull().sum()

This helps identify incomplete customer records.

Duplicate Customers

Duplicate customer records are checked using email addresses:

df.duplicated(subset=["email"], keep=False)

Null email values are excluded from duplicate-email detection.

Invalid Ages

Ages outside the range 0–120 are treated as invalid:

(df["age"] < 0) | (df["age"] > 120)

Invalid age values are converted to missing values during cleaning.

Invalid Emails

A basic email validation rule checks whether non-null email values contain:

@
.

For example:

ravi@gmail

is identified as an invalid email value.

Invalid email values are converted to missing values during cleaning.

City Standardization

City names are standardized using:

df["city"] = (
    df["city"]
    .str.strip()
    .str.title()
)

For example:

CHENNAI
 Chennai
chennai

becomes:

Chennai

📊 Example Data Flow

Example input:

ID: 7
Name: Suresh
Age: -5
City: Madurai
Email: suresh@gmail.com

The quality engine identifies:

Invalid age

During cleaning, the invalid age is converted to a missing value.

Similarly:

" Chennai"
"CHENNAI"
"chennai"

is standardized to:

"Chennai"

🔄 ETL Pipeline

The dashboard presents the complete ETL workflow:

01  CSV Input
       │
       ▼
02  Quality Analysis
       │
       ▼
03  Data Cleaning
       │
       ▼
04  MySQL Load
       │
       ▼
05  AI Insights

The pipeline demonstrates the core stages of a practical data engineering workflow:

Data ingestion

Data quality validation

Data transformation

Database loading

AI-assisted interpretation

📊 Quality Report

For the included sample dataset, the quality engine identifies issues such as:

Total records: 10
Missing values: 3
Duplicate records: 2
Invalid ages: 2
Invalid emails: 1
Quality Score: 20.0%

The cleaned dataset contains 9 records after duplicate removal.

The quality report is generated as JSON and can be used as an input to the Gemini analysis layer.

🌐 Backend API

The FastAPI backend exposes endpoints for the complete workflow.

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

FastAPI also provides interactive API documentation at:

http://127.0.0.1:8000/docs

💻 Installation

Prerequisites

Install:

Python 3.11+

MySQL

Node.js

npm

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd datamedic-ai

2. Create a Python Virtual Environment

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

3. Install Python Dependencies

pip install -r requirements.txt

4. Install Frontend Dependencies

cd frontend
npm install

Return to the project root:

cd ..

🔐 Environment Variables

Create a .env file in the project root.

Example:

GEMINI_API_KEY=your_gemini_api_key

MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=datamedic

Do not commit .env to GitHub.

The .gitignore file should include:

.env
*.db
__pycache__/
*.pyc
.venv/
venv/
.vscode/
node_modules/
sample_quality_report.json

If an API key is accidentally committed, revoke it and generate a new one.

🗄️ MySQL Setup

Create the database:

CREATE DATABASE datamedic;

Select the database:

USE datamedic;

Create the customers table according to the fields used by the project.

Example structure:

customers
├── id
├── name
├── email
├── age
└── city

Make sure the MySQL server is running before loading data.

▶️ Running the Application

Start the Backend

From the project root:

cd backend
uvicorn main:app --reload

The API will run at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

Start the Frontend

Open another terminal:

cd frontend
npm run dev

The Vite development server will provide the frontend URL shown in the terminal, typically:

http://localhost:5173

💬 Example Workflow

Upload CSV
     │
     ▼
Analyze Dataset
     │
     ▼
Detect Quality Issues
     │
     ▼
Generate Quality Report
     │
     ▼
Clean & Standardize Data
     │
     ▼
View Cleaned Records
     │
     ├──────────────► Download Cleaned CSV
     │
     ▼
Load Data into MySQL
     │
     ▼
Generate Gemini AI Insights

🤖 Example AI Analysis

The AI receives structured quality information such as:

Total Records: 10
Missing Values: 3
Duplicate Records: 2
Invalid Ages: 2
Invalid Emails: 1
Quality Score: 20.0%

Gemini then produces a human-readable interpretation:

Data Quality Report
        │
        ▼
Why the issues matter
        │
        ▼
Recommended actions
        │
        ▼
Overall dataset assessment

The AI does not replace the deterministic validation engine.

🗄️ MySQL Data Pipeline

The cleaned records are prepared for database storage.

Raw Customer Dataset
        │
        ▼
Data Quality Checks
        │
        ▼
Data Cleaning
        │
        ▼
Duplicate Removal
        │
        ▼
Value Standardization
        │
        ▼
MySQL
        │
        ▼
customers table

Example SQL Queries

View all customers:

SELECT * FROM customers;

Count loaded records:

SELECT COUNT(*)
FROM customers;

Group records by city:

SELECT city, COUNT(*)
FROM customers
GROUP BY city;

View customer information:

SELECT name, city
FROM customers;

📈 Dashboard

The React dashboard provides a centralized interface for:

Data-quality statistics

Quality score

Dataset records

Search and filtering

Cleaned data

CSV download

ETL pipeline progress

MySQL loading

Gemini AI insights

The dashboard allows users to inspect the dataset before and after transformation.

🎓 Data Engineering Concepts Demonstrated

DataMedic AI demonstrates practical skills in:

Data ingestion

ETL development

Data validation

Data quality assessment

Data cleaning

Data transformation

Duplicate detection

Missing-value detection

Data standardization

CSV processing

JSON reporting

SQL

MySQL

REST APIs

FastAPI

Database integration

Generative AI

API integration

Environment-based configuration

Error handling

🚀 Future Improvements

Potential future enhancements include:

Excel and JSON input support

Automated scheduled pipelines

Additional data-quality rules

Data lineage tracking

Structured logging

PostgreSQL support

Apache Airflow integration

PySpark processing for larger datasets

Cloud storage integration

Data warehouse integration

Automated anomaly detection

Advanced AI-assisted data-quality recommendations

🎯 Project Goals

DataMedic AI was built to demonstrate how practical Data Engineering + ETL + Data Quality + Generative AI techniques can be combined into a single application.

The core processing is deterministic:

Python
   +
Pandas
   +
ETL
   +
MySQL

Gemini adds a natural-language intelligence layer:

Data Quality Report
        │
        ▼
      Gemini
        │
        ▼
Explanation + Recommendations

The project focuses on using AI to interpret and explain data-quality results, while keeping the underlying validation and transformation logic predictable.

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

Automated quality report generation

Cleaned CSV export

Practical Data Engineering architecture

AI-assisted data-quality analysis