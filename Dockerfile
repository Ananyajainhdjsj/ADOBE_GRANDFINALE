FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# system deps for PyMuPDF and others
RUN apt-get update && apt-get install -y build-essential libsndfile1 libffi-dev libxml2-dev libxslt-dev libjpeg-dev libz-dev ffmpeg && rm -rf /var/lib/apt/lists/*

COPY backend1/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN ls
COPY backend1/app ./app
# ensure storage mount
RUN mkdir -p /app/storage
VOLUME ["/app/storage"]
RUN mkdir -p /app/temp_uploads
VOLUME ["/app/temp_uploads"]
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
