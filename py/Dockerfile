FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file if it exists
COPY requirements.txt* ./

# Install Python dependencies
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi


# Copy application code
COPY producer/ ./producer/
COPY consumer/ ./consumer/

# Create a non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Default command
CMD ["python", "-c", "print('Container ready. Use docker exec to run specific services.')"]