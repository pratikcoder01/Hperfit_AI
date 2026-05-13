# ─────────────────────────────────────────────
#  HyperFitness Phase 5 — Production Dockerfile
# ─────────────────────────────────────────────

# --- Build Stage ---
FROM python:3.11-slim-bullseye as builder

WORKDIR /app

# Install system dependencies for CV and ML
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# --- Runtime Stage ---
FROM python:3.11-slim-bullseye

WORKDIR /app

# Install runtime CV dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python packages
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production

# Expose FastAPI port
EXPOSE 8000

# Start application with Gunicorn/Uvicorn for production scaling
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "main:app", "--workers", "4"]
