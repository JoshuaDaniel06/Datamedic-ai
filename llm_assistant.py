from google import genai
from dotenv import load_dotenv
import time

load_dotenv()

client = genai.Client()


def analyze_quality_report(report):

    prompt = f"""
You are a Data Quality Assistant helping a Data Engineer.

Analyze the following data quality report:

Total records: {report['total_records']}
Missing values: {report['missing_values']}
Duplicate records: {report['duplicate_records']}
Invalid age records: {report['invalid_age_records']}
Invalid email records: {report['invalid_email_records']}
Quality score: {report['quality_score']}%

Provide:

1. A short explanation of the detected problems.
2. Why these problems matter.
3. Recommended actions for a Data Engineer.
4. A short overall assessment of the dataset.

Keep the explanation simple and practical.
"""

    # Try Gemini up to 2 times
    for attempt in range(2):

        try:

            print("Starting Gemini request...")

            interaction = client.interactions.create(
                model="gemini-3.5-flash",
                input=prompt,
                generation_config={
                    "thinking_level": "minimal"
                },
                timeout=15000
            )

            print("Gemini response received.")

            return interaction.output_text

        except Exception as e:

            print(
                f"Gemini request failed "
                f"(attempt {attempt + 1}/2)"
            )

            print("Error:", e)

            # Wait briefly before retrying
            if attempt < 1:
                print("Retrying in 2 seconds...\n")
                time.sleep(2)

    return """
AI analysis is temporarily unavailable.

The Data Quality Pipeline itself completed successfully,
but Gemini could not be reached at this time.

Please try running the project again later.
"""