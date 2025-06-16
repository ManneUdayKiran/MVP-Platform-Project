# Base image with Python and system tools
FROM python:3.10-slim

# Install system dependencies (includes Rust)
RUN apt-get update && \
    apt-get install -y build-essential curl git && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    export PATH="/root/.cargo/bin:$PATH" && \
    apt-get clean

# Set environment variable to access Rust globally
ENV PATH="/root/.cargo/bin:$PATH"

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start your app (adjust this as needed)
CMD ["python", "main.py"]
