import os
import re
import httpx
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse, JSONResponse
from utils.file_utils import save_file, list_files, get_file_content, setup_project_structure
from fastapi.responses import FileResponse
import shutil
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from pathlib import Path

# Get current file path
current_dir = Path(__file__).resolve().parent

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project directories
BASE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "projects")
PROJECT_DIR, PUBLIC_DIR = setup_project_structure(BASE_DIR)

# === Config ===
GROQ_API_KEY = "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"  # Store in .env or shell
GROQ_MODEL = "deepseek-r1-distill-llama-70b"  # or llama3-8b-8192, gemma2-9b-it

# === Request Models ===
class PromptRequest(BaseModel):
    prompt: str

class UpdateFileRequest(BaseModel):
    filename: str
    content: str

class AutoFixErrorRequest(BaseModel):
    error_message: str
    stack_trace: str
    file_content: str = ""
    filename: str = ""

# === Utility Functions ===
def parse_fenced_code_blocks(text: str) -> dict:
    try:
        logger.info(f"Raw response from Groq: {text[:500]}...")
        pattern = r"```([\w.\-/+]+)\n([\s\S]+?)```"
        matches = re.findall(pattern, text)
        
        if not matches:
            logger.error("No code blocks found in response")
            return {}
            
        files = {}
        for filename, code in matches:
            filename = filename.strip()
            code = code.strip()
            if filename and code:  # Only add if both filename and code are non-empty
                files[filename] = code
                logger.info(f"Parsed file: {filename}")
        
        return files
    except Exception as e:
        logger.error(f"Error parsing code blocks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error parsing code blocks: {str(e)}")

def get_missing_files(files: dict) -> list:
    required_files = {
        'public/index.html',
        'src/App.js',
        'src/index.js',
        'src/App.css',
        'src/index.css',
        'src/server.js'
    }
    
    # Get the set of files present, normalizing paths
    files_present = set()
    for filename in files.keys():
        # Remove any nested src/ or public/ prefixes
        if filename.startswith('src/src/'):
            filename = filename.replace('src/src/', 'src/')
        elif filename.startswith('public/public/'):
            filename = filename.replace('public/public/', 'public/')
        files_present.add(filename)
    
    # Find missing files
    missing = list(required_files - files_present)
    
    # If no backend file is present, add it to missing
    has_backend = any(f.endswith(('server.js', 'main.py')) for f in files_present)
    if not has_backend:
        missing.append('src/server.js')
    
    return missing

async def call_llm_with_prompt(user_prompt: str, system_prompt: str):
    try:
        payload = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 4000,  # Increased token limit
        }

        logger.info(f"Calling Groq API with model: {GROQ_MODEL}")
        async with httpx.AsyncClient(timeout=120) as client:  # Increased timeout
            res = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
            )
            res.raise_for_status()
            response_data = res.json()
            if "choices" not in response_data or not response_data["choices"]:
                raise HTTPException(status_code=500, detail="Invalid response from Groq API")
            return response_data["choices"][0]["message"]["content"]
    except httpx.HTTPError as e:
        logger.error(f"HTTP error calling Groq API: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error calling Groq API: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/generate")
async def generate_code(req: PromptRequest):
    logger.info(f"Received generation request with prompt: {req.prompt[:100]}...")
    
    system_prompt = (
        "You are an expert fullstack developer. Generate an application according to user preference "
        "based on the user's idea. Your response must be in two parts:\n\n"
        "PART 1 - TEXT RESPONSE:\n"
        "First, provide a text response that includes:\n"
        "1. A brief summary of the user's idea\n"
        "2. A friendly message about the generated application\n"
        "3. Suggestions for customization\n"
        "Format this as a single text block without any code blocks.\n\n"
        
        "PART 2 - CODE FILES:\n"
        "Then, provide all the required code files in markdown blocks. Required files (with exact paths):\n"
        "1. public/index.html\n"
        "2. src/App.js\n"
        "3. src/index.js\n"
        "4. src/App.css\n"
        "5. src/index.css\n"
        "6. src/server.js\n"
        
        "Format each file like this:\n"
        "```public/index.html\ncode content\n```\n"
        "```src/App.js\ncode content\n```\n\n"
        
        "Important:\n"
        "- Each file must be in its own code block\n"
        "- Use EXACT filenames with paths as shown above\n"
        "- Include ALL required files\n"
        "- Make sure the code is complete and runnable\n"
        "- The paths must match exactly: public/index.html, src/App.js, etc.\n"
        "- If you miss any required files, the generation will fail\n"
        "- Double-check that you've included all required files before responding\n\n"
        
        "Data Handling:\n"
        "- For applications that would normally require external APIs, use simulated data instead:\n"
        "  1. Weather App: Use a weatherData array with 5-7 days of simulated weather data\n"
        "  2. Maps App: Use a locations array with 5-7 predefined locations\n"
        "  3. E-commerce: Use a products array with 5-7 sample products\n"
        "  4. Social Media: Use a posts array with 5-7 sample posts\n"
        "  5. News App: Use a newsData array with 5-7 sample news articles\n"
        "- Include a comment in the code indicating this is simulated data\n"
        "- Add a note in the UI that this is using simulated data\n"
        "- Make the simulated data realistic and varied\n"
        "- Include all necessary fields that would be present in real API responses\n"
        "- Structure the data to match typical API response formats\n"
        "- Add comments explaining how to replace with real API data\n\n"
        
       "Styling Requirements:\n"
"- Add modern, responsive styles in src/index.css\n"
"- Use CSS variables for consistent theming\n"
"- Include styles for common elements (buttons, inputs, containers)\n"
"- Add responsive design with media queries\n"
"- Use flexbox or grid for layouts\n"
"- Include hover and focus states for interactive elements\n"
"- Add smooth transitions and animations using only advanced CSS (e.g., transform, opacity, scale, keyframes)\n"
"- Use CSS keyframe animations and transition properties for interactive effects (e.g., fade-in, slide-up, scale on hover)\n"
"- Ensure styles are scoped to prevent conflicts\n"
        "- Use CSS modules or styled-components for scoped styles\n"
        "- Ensure styles are modular and reusable\n"
"- Make sure App.js imports and uses the styles correctly\n\n"



        
        "Text Response Template:\n"
        "Use this format for the text response (PART 1):\n"
        "'I understand you want to create [brief description of the app]. I've generated a [type of app] application that includes [key features].\n\n"
        "The application is now ready for you to explore! Feel free to make any adjustments to better match your vision. You can:\n"
        "- Modify the simulated data to test different scenarios\n"
        "- Customize the UI styling to match your preferences\n"
        "- Add new features or modify existing ones\n"
        "- Adjust the layout or functionality as needed\n\n"
        "Let me know if you'd like to make any specific changes or have questions about the implementation!'"
    )

    user_prompt = req.prompt
    max_retries = 2  # Increased retries
    missing_files = []

    for attempt in range(max_retries + 1):
        try:
            logger.info(f"Attempt {attempt + 1} of {max_retries + 1}")
            content = await call_llm_with_prompt(user_prompt, system_prompt)
            code_files = parse_fenced_code_blocks(content)
            
            if not code_files:
                logger.error("No code files parsed from response")
                raise HTTPException(status_code=500, detail="No code files found in the response")
                
            missing = get_missing_files(code_files)
            logger.info(f"Missing files: {missing}")

            if not missing:
                files_content = {}
                for filename, code in code_files.items():
                    try:
                        # Save to appropriate directory based on file type
                        if filename.startswith('public/'):
                            actual_filename = filename.replace('public/', '')
                            save_file(PUBLIC_DIR, actual_filename, code)
                        else:
                            actual_filename = filename.replace('src/', '')
                            save_file(PROJECT_DIR, actual_filename, code)
                        
                        # Store the file content for the response
                        files_content[filename] = code
                    except Exception as e:
                        logger.error(f"Error saving file {filename}: {str(e)}")
                        raise HTTPException(status_code=500, detail=f"Error saving file {filename}: {str(e)}")
                
                return {
                    "message": "Files generated",
                    "files": files_content,
                    "text_response": "Files generated successfully!"
                }

            # Store missing files for the error message
            missing_files = missing

            # Retry by updating the user prompt with more specific instructions
            user_prompt += (
                f"\n\nIMPORTANT: Your last response was missing these required files: {', '.join(missing)}. "
                f"Please regenerate and include ALL of these files. Each file must be in its own code block with the EXACT filename and path. "
                f"For example:\n"
                f"```src/index.css\n/* Your CSS code here */\n```\n"
                f"Make sure to include ALL missing files in your response."
            )
        except Exception as e:
            logger.error(f"Error in generation attempt {attempt + 1}: {str(e)}")
            if attempt == max_retries:
                raise HTTPException(
                    status_code=500, 
                    detail=f"Generation failed after {max_retries + 1} attempts. Missing files: {', '.join(missing_files)}"
                )

    raise HTTPException(
        status_code=500, 
        detail=f"Failed to generate all required files after {max_retries + 1} attempts. Missing files: {', '.join(missing_files)}"
    )

@app.get("/files")
def get_file_list():
    try:
        return {"files": list_files(PROJECT_DIR)}
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}")

@app.get("/file")
def read_file(name: str):
    try:
        # Handle paths correctly
        if name.startswith('public/'):
            filepath = os.path.join(PUBLIC_DIR, name.replace('public/', ''))
        elif name.startswith('src/'):
            filepath = os.path.join(PROJECT_DIR, name.replace('src/', ''))
        else:
            # If no prefix, try both directories
            public_path = os.path.join(PUBLIC_DIR, name)
            src_path = os.path.join(PROJECT_DIR, name)
            
            if os.path.exists(public_path):
                filepath = public_path
            elif os.path.exists(src_path):
                filepath = src_path
            else:
                raise HTTPException(status_code=404, detail=f"File {name} not found")
            
        logger.info(f"Reading file from path: {filepath}")
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail=f"File {name} not found")
            
        with open(filepath, 'r', encoding='utf-8') as f:
            return {"filename": name, "content": f.read()}
    except Exception as e:
        logger.error(f"Error reading file {name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@app.post("/update_file")
def update_file(data: UpdateFileRequest):
    try:
        # Handle paths correctly
        if data.filename.startswith('public/'):
            filepath = os.path.join(PUBLIC_DIR, data.filename.replace('public/', ''))
        elif data.filename.startswith('src/'):
            filepath = os.path.join(PROJECT_DIR, data.filename.replace('src/', ''))
        else:
            # If no prefix, try to determine the correct directory
            if data.filename.endswith('.html'):
                filepath = os.path.join(PUBLIC_DIR, data.filename)
            else:
                filepath = os.path.join(PROJECT_DIR, data.filename)
            
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(data.content)
            
        return {"message": "File updated"}
    except Exception as e:
        logger.error(f"Error updating file {data.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating file: {str(e)}")

@app.get("/preview/{filename}")
def serve_preview(filename: str):
    try:
        # Handle paths correctly
        if filename.startswith('public/'):
            filepath = os.path.join(PUBLIC_DIR, filename.replace('public/', ''))
        elif filename.startswith('src/'):
            filepath = os.path.join(PROJECT_DIR, filename.replace('src/', ''))
        else:
            # If no prefix, try both directories
            public_path = os.path.join(PUBLIC_DIR, filename)
            src_path = os.path.join(PROJECT_DIR, filename)
            
            if os.path.exists(public_path):
                filepath = public_path
            elif os.path.exists(src_path):
                filepath = src_path
            else:
                raise HTTPException(status_code=404, detail="File not found")
            
        if not os.path.isfile(filepath):
            raise HTTPException(status_code=404, detail="File not found")
        return FileResponse(filepath)
    except Exception as e:
        logger.error(f"Error serving preview for {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error serving preview: {str(e)}")

@app.post("/auto-fix-error")
async def auto_fix_error(req: AutoFixErrorRequest):
    logger.info(f"Received auto-fix request for file: {req.filename}")
    system_prompt = (
        "You are an expert fullstack developer and code fixer. Given the following error message, stack trace, and code, suggest a patch or fixed code to resolve the error. "
        "Return ONLY the fixed code, or a unified diff if appropriate. Do not include explanations.\n\n"
        f"Error message: {req.error_message}\n"
        f"Stack trace: {req.stack_trace}\n"
        f"Filename: {req.filename}\n"
        f"Code:\n{req.file_content}\n"
        "---\n"
        "Respond with the fixed code or a patch."
    )
    user_prompt = (
        f"Error: {req.error_message}\n"
        f"Stack trace: {req.stack_trace}\n"
        f"Filename: {req.filename}\n"
        f"Code:\n{req.file_content}\n"
    )
    try:
        patch = await call_llm_with_prompt(user_prompt, system_prompt)
        if not patch.strip():
            return {"patch": "", "message": "No fix could be suggested by the AI."}
        return {"patch": patch, "message": "Suggested fix generated."}
    except Exception as e:
        logger.error(f"Auto-fix error: {str(e)}")
        return {"patch": "", "message": f"Auto-fix failed: {str(e)}"}
@app.get("/download")
def download_app():
    source_folder = current_dir.parent / "projects"
    output_zip = "app_download.zip"

    if not os.path.exists(source_folder):
        return {"error": "Source folder does not exist"}

    shutil.make_archive("app_download", 'zip', source_folder)
    return FileResponse(path=output_zip, filename="MyApp.zip", media_type='application/zip')