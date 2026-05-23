# Closira Backend - FastAPI REST API

A lightweight backend service that simulates Closira's core customer enquiry pipeline.

## Features

- **Inbound enquiry intake** across WhatsApp, Email, and Call channels
- **Async SOP matching** — background task classifies each message and generates a suggested response
- **Follow-up scheduling** with configurable delay and message templates
- **Escalation management** — manual or automatic (no SOP match)
- **Full history & timeline** for every enquiry
- **Structured JSON logging** for all key events
- **SQLite database** (configurable to PostgreSQL via `DATABASE_URL`)

## Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server starts at **http://localhost:8000**

## API Documentation

Once the server is running, visit:
- **Interactive API docs (Swagger)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Directory Structure

```
backend/
├── app/
│   ├── api/              # Route handlers
│   │   ├── enquiry.py   # Enquiry endpoints
│   │   └── health.py    # Health check endpoint
│   ├── core/             # Config, database, logging
│   │   ├── config.py
│   │   ├── database.py
│   │   └── logging.py
│   ├── models/           # SQLAlchemy ORM models
│   │   └── enquiry.py
│   ├── schemas/          # Pydantic request/response schemas
│   │   └── enquiry.py
│   ├── services/         # Business logic
│   │   ├── enquiry_service.py
│   │   └── sop_matcher.py
│   └── tasks/            # Background task dispatcher
│       └── sop_processor.py
├── main.py               # FastAPI app entry point
├── requirements.txt
└── curl_tests.sh         # Smoke tests
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Create Enquiry

```bash
POST /enquiry
Content-Type: application/json

{
  "customer_name": "Sarah M.",
  "channel": "whatsapp",
  "message": "Hi, what are your pricing plans?"
}
```

Response (202 Accepted):
```json
{
  "job_id": "3f7c1a2b-...",
  "status": "pending",
  "message": "Enquiry received. Processing in background."
}
```

### Get Enquiry History

```bash
GET /enquiry/{enquiry_id}/history
```

### Schedule Follow-up

```bash
POST /enquiry/{enquiry_id}/followup
Content-Type: application/json

{
  "delay_minutes": 30,
  "message_template": "Hi {name}, following up on your enquiry!"
}
```

### Escalate Enquiry

```bash
POST /enquiry/{enquiry_id}/escalate
Content-Type: application/json

{
  "reason": "Customer requested escalation to manager."
}
```

## Testing

Run the curl smoke tests:

```bash
chmod +x curl_tests.sh
./curl_tests.sh
```

## Environment Variables

Create a `.env` file in the backend directory (optional):

```
APP_NAME=Closira Enquiry API
APP_VERSION=1.0.0
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./closira.db
LOG_LEVEL=INFO
```

## Database

The SQLite database (`closira.db`) is created automatically on first run. No migrations needed.

## Architecture

- **FastAPI** for REST API with async support
- **SQLAlchemy** with async driver for database
- **Pydantic** for request/response validation
- **BackgroundTasks** for async SOP processing (no Celery/Redis required)
- **JSON logging** for structured logs
