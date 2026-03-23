import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

# Gunakan klien asinkron
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def ai_review(code):
    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY tidak ditemukan di environment.")

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
    try:
        # Tunggu respons AI tanpa mengunci server
        chat = await client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant"
        )
        return chat.choices[0].message.content
    except Exception as e:
        raise Exception(f"Kegagalan koneksi AI: {str(e)}")