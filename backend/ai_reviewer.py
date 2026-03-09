import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ai_review(code):

    prompt = f"""
You are a senior software engineer.

Analyze this Python code and explain:
1. Bugs
2. Performance issues
3. Code style problems
4. Suggested improvements
5. Time complexity

Code:
{code}
"""

    chat = client.chat.completions.create(
    messages=[
        {"role": "user", "content": prompt}
    ],
    model="llama-3.1-8b-instant"
)

    return chat.choices[0].message.content