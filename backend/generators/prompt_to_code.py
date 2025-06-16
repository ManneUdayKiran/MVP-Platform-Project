# Stub: Replace with actual LLM call
def generate_code_from_prompt(prompt: str) -> dict:
    return {
        "index.html": f"<!DOCTYPE html><html><body><h1>{prompt}</h1></body></html>",
        "App.js": "import React from 'react';\nexport default function App() { return <h1>Hello</h1>; }",
    }
