FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM base AS dev
CMD ["python", "app.py"]

FROM base AS prod
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
