import httpx
import os

GROQ_API_KEY = "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"  # Store in .env or shell
GROQ_MODEL = "gemma2-9b-it"

def generate_code_from_prompt(prompt: str) -> dict:
    system_prompt = (
        "You're an expert fullstack developer. Given a prompt like "
        "'a voice-controlled planner', generate a working MVP with HTML/CSS, React code, and backend code. "
        "Output each file in markdown fenced code blocks like: ```filename.ext\ncode\n```"
    )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }

    with httpx.Client(timeout=60) as client:
        res = client.post("https://api.groq.com/openai/v1/chat/completions", json=body, headers=headers)
        data = res.json()
    
    content = data["choices"][0]["message"]["content"]
    return parse_fenced_code_blocks(content)

def parse_fenced_code_blocks(text: str) -> dict:
    import re
    pattern = r"```([\w./+-]*)\n([\s\S]+?)```"
    matches = re.findall(pattern, text)
    return {filename.strip() or f"file{idx}.txt": code.strip() for idx, (filename, code) in enumerate(matches)}
