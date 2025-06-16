import os
import logging

logger = logging.getLogger(__name__)

def setup_project_structure(base_dir: str):
    """Set up the project directory structure."""
    try:
        # Create base projects directory
        os.makedirs(base_dir, exist_ok=True)
        
        # Create src and public directories
        src_dir = os.path.join(base_dir, "src")
        public_dir = os.path.join(base_dir, "public")
        
        os.makedirs(src_dir, exist_ok=True)
        os.makedirs(public_dir, exist_ok=True)
        
        logger.info(f"Project structure created at {base_dir}")
        return src_dir, public_dir
    except Exception as e:
        logger.error(f"Error setting up project structure: {str(e)}")
        raise Exception(f"Error setting up project structure: {str(e)}")

def save_file(directory: str, filename: str, content: str):
    """Save a file to the specified directory."""
    try:
        # Remove any nested src/ or public/ prefixes
        if filename.startswith('src/src/'):
            filename = filename.replace('src/src/', 'src/')
        elif filename.startswith('public/public/'):
            filename = filename.replace('public/public/', 'public/')
            
        # Remove src/ or public/ prefix if present
        if filename.startswith('src/'):
            filename = filename.replace('src/', '')
        elif filename.startswith('public/'):
            filename = filename.replace('public/', '')
            
        filepath = os.path.join(directory, filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        logger.info(f"Saved file to {filepath}")
    except Exception as e:
        logger.error(f"Error saving file {filename}: {str(e)}")
        raise Exception(f"Error saving file {filename}: {str(e)}")

def list_files(directory: str) -> list:
    """List all files in the specified directory."""
    try:
        files = []
        for root, _, filenames in os.walk(directory):
            for filename in filenames:
                rel_path = os.path.relpath(os.path.join(root, filename), directory)
                files.append(rel_path)
        return files
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise Exception(f"Error listing files: {str(e)}")

def get_file_content(directory: str, filename: str) -> str:
    """Get the content of a file."""
    try:
        # Remove src/ or public/ prefix if present
        if filename.startswith('src/'):
            filename = filename.replace('src/', '')
        elif filename.startswith('public/'):
            filename = filename.replace('public/', '')
            
        filepath = os.path.join(directory, filename)
        if not os.path.exists(filepath):
            raise Exception(f"File {filename} not found")
            
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading file {filename}: {str(e)}")
        raise Exception(f"Error reading file {filename}: {str(e)}")
