# 🩺 DataMedic AI — Intelligent Data Quality & Cleaning Assistant

DataMedic AI is an AI-assisted **Data Engineering and Data Quality pipeline** designed to identify, analyze, clean, and transform raw customer data.

The project uses **Python and Pandas** for data validation and transformation, **MySQL** for storing cleaned data, and the **Gemini API** to generate human-readable explanations and recommendations based on the detected data-quality issues.

---

## 📌 Project Overview

In real-world applications, raw data often contains quality problems such as:

* Missing values
* Duplicate customer records
* Invalid numerical values
* Invalid email addresses
* Inconsistent text formatting
* Unstandardized data

DataMedic AI automates the initial data-quality process instead of requiring these problems to be identified manually.

The pipeline:

```text
Raw Customer CSV
       ↓
Python / Pandas
       ↓
Data Quality Checks
       ↓
Data Cleaning & Standardization
       ↓
Quality Report
       ↓
MySQL Database
       ↓
Gemini AI Analysis
       ↓
AI Explanation & Recommendations
```

---

## 🎯 Problem Statement

Poor-quality data can lead to:

* Incorrect analytics
* Duplicate customer information
* Incorrect business reports
* Invalid calculations
* Database inconsistencies
* Unreliable decision-making

For example, a customer record with a negative age, missing email, or duplicate email address should be identified before the data is used for further analysis.

DataMedic AI provides an automated pipeline to detect these issues and make the data more reliable.

---

## ✨ Features

### 🔍 Automated Data Quality Checks

The pipeline checks customer data for:

* Missing values
* Duplicate customers
* Invalid ages
* Invalid email formats
* Inconsistent city formatting

### 🧹 Data Cleaning

The project performs transformations such as:

* Removing duplicate customer records
* Standardizing city names
* Handling invalid age values
* Handling invalid email values
* Preparing cleaned records for database storage

### 📊 Data Quality Report

The pipeline generates a JSON report containing:

* Total records
* Missing values
* Duplicate records
* Invalid age records
* Invalid email records
* Overall quality score

Example:

```json
{
    "total_records": 10,
    "missing_values": 1,
    "duplicate_records": 2,
    "invalid_age_records": 1,
    "invalid_email_records": 0,
    "quality_score": 60.0
}
```

> The values above are an example of the report format. The actual values depend on the input dataset and the quality-score calculation.

### 🗄️ MySQL Integration

Cleaned customer data is loaded into a MySQL database for persistent storage and SQL-based analysis.

Example database structure:

```text
datamedic
└── customers
```

### 🤖 Gemini AI Integration

The generated quality report is passed to Gemini through the Gemini API.

The AI analyzes the report and provides:

1. A short explanation of detected problems
2. Why the problems matter
3. Recommended actions for a Data Engineer
4. An overall assessment of the dataset

This allows technical data-quality metrics to be converted into an easy-to-understand explanation.

### 🔄 Error Handling

The Gemini integration includes retry logic.

If the API request temporarily fails, the application retries the request before returning a fallback message.

---

## 🏗️ System Architecture

```text
                         DataMedic AI
                              │
                              ▼
                    ┌──────────────────┐
                    │  customers.csv   │
                    │    Raw Data      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Python + Pandas  │
                    │  Data Ingestion  │
                    └────────┬─────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │   Data Quality Checks    │
                │                          │
                │ • Missing Values         │
                │ • Duplicate Customers   │
                │ • Invalid Ages           │
                │ • Invalid Emails        │
                │ • City Formatting        │
                └────────────┬─────────────┘
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
         │ Quality Report  │   │     MySQL      │
         │     JSON        │   │    Database    │
         └────────┬────────┘   └────────────────┘
                  │
                  ▼
          ┌─────────────────┐
          │   Gemini API    │
          │  AI Analysis    │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ AI Explanation  │
          │ & Recommendations│
          └─────────────────┘
```

---

## 🛠️ Technology Stack

| Technology                 | Purpose                          |
| -------------------------- | -------------------------------- |
| **Python**                 | Core programming language        |
| **Pandas**                 | Data processing and validation   |
| **MySQL**                  | Database storage                 |
| **MySQL Connector/Python** | Python-to-MySQL connectivity     |
| **Gemini API**             | AI-powered data-quality analysis |
| **Google GenAI SDK**       | Gemini API integration           |
| **python-dotenv**          | Environment variable management  |
| **JSON**                   | Quality report generation        |
| **VS Code**                | Development environment          |

---

## 📂 Project Structure

```text
datamedic-ai/
│
├── .gitignore
├── README.md
├── requirements.txt
│
├── customers.csv
│
├── main.py
├── load_mysql.py
├── llm_assistant.py
│
└── sample_quality_report.json
```

### File Description

| File                         | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| `customers.csv`              | Raw customer dataset used as the input                               |
| `main.py`                    | Performs data-quality checks, generates the report, and calls Gemini |
| `load_mysql.py`              | Cleans/transforms data and loads it into MySQL                       |
| `llm_assistant.py`           | Handles Gemini API communication and AI analysis                     |
| `sample_quality_report.json` | Example output generated by the quality-analysis pipeline            |
| `requirements.txt`           | Python dependencies required by the project                          |
| `.gitignore`                 | Prevents sensitive and unnecessary files from being committed        |

---

## 🔎 Data Quality Rules

### 1. Missing Values

The pipeline identifies missing values using Pandas:

```python
df.isnull().sum()
```

This helps identify incomplete customer records.

---

### 2. Duplicate Customers

Customers are checked using their email addresses.

```python
df.duplicated(subset=["email"], keep=False)
```

This helps identify multiple records that may represent the same customer.

---

### 3. Invalid Ages

The project considers ages outside the range of `0–120` invalid.

```python
(df["age"] < 0) | (df["age"] > 120)
```

Invalid values are identified during quality analysis and handled during the transformation stage.

---

### 4. Invalid Emails

A basic email validation rule checks whether non-null email values contain:

* `@`
* `.`

This provides a simple first-level validation before the data is loaded into the database.

---

### 5. City Standardization

City values are standardized using:

```python
df["city"] = df["city"].str.strip().str.title()
```

For example:

```text
CHENNAI
 Chennai
chennai
```

can be standardized to:

```text
Chennai
```

---

## 📊 Example Data Flow

Input:

```text
Customer ID: C006
Name: Suresh Babu
Age: -5
City: Madurai
Email: suresh@gmail.com
```

The quality engine identifies:

```text
Invalid age
```

The transformation stage can then convert the invalid age to a database-compatible missing value.

Similarly, inconsistent city formatting such as:

```text
" Chennai"
"CHENNAI"
```

is standardized to:

```text
"Chennai"
```

---

## 🤖 AI Analysis

After the data-quality checks are completed, DataMedic AI sends the generated quality report to Gemini.

The prompt asks Gemini to provide:

```text
1. Explanation of detected problems
2. Why the problems matter
3. Recommended actions
4. Overall dataset assessment
```

The AI therefore acts as an **interpretation layer** rather than replacing the deterministic data-quality rules.

### Architecture Principle

```text
Deterministic Processing
        ↓
Python + Pandas
        ↓
Data Quality Report
        ↓
AI Interpretation
        ↓
Gemini
```

This separation allows the core data-quality checks to remain predictable while using AI for natural-language analysis.

---

## 🗄️ MySQL Data Pipeline

The `load_mysql.py` script:

1. Reads the customer CSV
2. Removes duplicate customer records
3. Standardizes city names
4. Identifies invalid ages
5. Handles invalid email values
6. Connects to MySQL
7. Refreshes the customer table
8. Inserts the transformed records

The resulting data can then be queried using SQL.

Example:

```sql
SELECT * FROM customers;
```

Other example queries:

```sql
SELECT COUNT(*)
FROM customers;
```

```sql
SELECT city, COUNT(*)
FROM customers
GROUP BY city;
```

```sql
SELECT name, city
FROM customers;
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd datamedic-ai
```

---

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

```text
GEMINI_API_KEY=your_gemini_api_key
```

For MySQL, configure:

```text
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=datamedic
```

### Important

The `.env` file contains sensitive credentials and should **never be committed to GitHub**.

The repository includes `.gitignore` rules to prevent it from being uploaded.

---

## 🗄️ MySQL Setup

Create the database:

```sql
CREATE DATABASE datamedic;
```

Select it:

```sql
USE datamedic;
```

Create the customer table according to the columns used by `customers.csv` and `load_mysql.py`.

Make sure the MySQL server is running before executing the database-loading script.

---

## ▶️ Running the Project

### Run the Data Quality + AI Pipeline

From the project directory:

```powershell
python main.py
```

The program:

```text
Loads CSV
   ↓
Checks data quality
   ↓
Displays detected issues
   ↓
Calculates quality score
   ↓
Creates quality_report.json
   ↓
Sends report to Gemini
   ↓
Displays AI analysis
```

---

### Load Cleaned Data into MySQL

Run:

```powershell
python load_mysql.py
```

The script transforms the data and loads the cleaned records into the MySQL `customers` table.

---

## 📈 Example Console Output

```text
CSV file loaded successfully!

Missing values:
email    1
...

Duplicate customers:
...

Invalid ages:
...

Invalid emails:
...

Standardized cities:
...

DATA QUALITY REPORT
---------------------------
Total records: 10
Missing values: 1
Duplicate records: ...
Invalid ages: 1
Invalid emails: 0
Quality Score: ...

Quality report saved!

AI ANALYSIS
---------------------------

[Gemini-generated explanation and recommendations]
```

---

## 🔒 Security

Sensitive credentials are stored using environment variables rather than hard-coded in Python.

The following files should not be committed:

```text
.env
*.db
__pycache__/
*.pyc
```

Never publish an API key in source code or GitHub.

If an API key is accidentally committed, revoke it and generate a new key.

---

## 🎓 Data Engineering Concepts Demonstrated

This project demonstrates practical concepts relevant to Data Engineering and ETL development:

* Data ingestion
* Data validation
* Data quality assessment
* Data cleaning
* Data transformation
* Duplicate detection
* Missing-value detection
* Data standardization
* ETL pipeline design
* Relational database integration
* SQL analysis
* JSON reporting
* API integration
* LLM integration
* Error handling
* Environment-based configuration

---

## 🚀 Future Improvements

Potential future enhancements include:

* Support for Excel and JSON input files
* Automated scheduled data pipelines
* Additional data-quality rules
* Data-quality dashboards
* Data lineage tracking
* Structured logging
* PostgreSQL support
* Apache Airflow integration
* PySpark-based processing for larger datasets
* Cloud storage integration
* Data warehouse integration
* Automated anomaly detection
* More advanced AI-assisted data-quality recommendations

---

## 🎯 Project Goal

The goal of DataMedic AI is to demonstrate how a practical data-quality pipeline can combine traditional **Data Engineering techniques** with modern **Generative AI**.

The core pipeline remains deterministic:

```text
Python
  +
Pandas
  +
ETL
  +
MySQL
```

while Gemini provides an additional natural-language intelligence layer:

```text
Data Quality Report
        ↓
      Gemini
        ↓
Explanation + Recommendations
```

---

## 👨‍💻 Author

**Joshua Daniel**

Aspiring Data Engineer

### Core Technologies

```text
Python • SQL • Pandas • MySQL • ETL • Data Quality • Gemini AI
```
