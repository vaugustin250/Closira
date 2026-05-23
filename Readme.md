<h1 align="center">Closira</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Async-Background%20Tasks-FF9900?style=for-the-badge&logo=python&logoColor=white" alt="Async" />
</p>

<p align="center">
  <strong>The AI-powered customer communication platform for SMBs.</strong><br>
  Manage inbound enquiries across WhatsApp, Email, and Phone seamlessly.
</p>

---

## 🌟 Overview

Closira is a unified communication platform designed to help small and medium businesses (SMBs) manage customer conversations efficiently. It automatically ingests inbound customer enquiries, uses business-defined Standard Operating Procedures (SOPs) to categorize and auto-respond to them, and escalates complex queries to human agents when necessary.

This repository contains the complete stack for the Closira platform, separated into two distinct layers:
1. **[Backend API](/backend/)**: A robust, asynchronous FastAPI service that handles the heavy lifting of message ingestion, SOP matching, and follow-up scheduling.
2. **[Frontend Mobile App](/frontend/)**: A polished, responsive React Native (Expo) dashboard for business owners to monitor leads, manage escalations, and track follow-ups on the go.

---

## 🚀 Features

### 🔧 Backend Architecture
- **Multi-channel Intake**: REST API designed to ingest messages from WhatsApp, Email, and Phone simultaneously.
- **Async Processing Pipeline**: Heavy lifting (like SOP matching) is offloaded to non-blocking background tasks to ensure lightning-fast API responses.
- **Automated SOP Matching**: Automatically classifies inbound messages based on predefined rules (e.g., Booking, Pricing, Complaints) and suggests contextual responses.
- **Auto-Escalation**: If a customer's query doesn't match an existing SOP, the system automatically flags it and escalates it to a human agent.
- **Follow-up Engine**: Allows agents to schedule delayed follow-up messages using templates.
- **Structured JSON Logging**: Enterprise-grade structured logging for full traceability of the enquiry lifecycle.

### 📱 Mobile Dashboard (UI/UX)
- **Material Design 3 aesthetic**: A rich, vibrant, and intuitive interface with a beautiful color system and gradient styling.
- **Real-time Overview**: The home dashboard provides immediate insights into new leads, open escalations, missed enquiries, and follow-ups due today.
- **Conversation Timelines**: Dive deep into any lead to see the full history, AI summaries, and channel sources.
- **Action-Oriented Escalation Management**: Dedicated views to quickly resolve high-priority customer complaints.

---

## 🏗️ Technical Decisions & Trade-offs

### Why FastAPI + BackgroundTasks?
For our async processing pipeline, we opted to use **FastAPI's native `BackgroundTasks`** instead of a heavier broker like Celery/Redis. 
- **Reasoning**: It keeps the system architecture lightweight and easy to deploy without needing external infrastructure dependencies (like a Redis broker or RabbitMQ). It is perfectly suited for our current I/O bound tasks (like SOP text matching).
- **Trade-off**: Native background tasks do not persist across server restarts. If the application scales to require distributed task queues or guaranteed at-least-once execution semantics, migrating to Celery would be the next logical step.

### Why SQLite?
- **Reasoning**: SQLite provides a frictionless setup experience for this prototype. It requires zero configuration and works out of the box using SQLAlchemy's async engine.
- **Trade-off**: It is not suited for high-concurrency write environments. The application's ORM is completely database-agnostic, meaning switching to **PostgreSQL** in production simply requires updating the `DATABASE_URL` connection string.

### Why StyleSheet over NativeWind (Tailwind)?
- **Reasoning**: We chose native React Native `StyleSheet` paired with a strongly-typed, centralized `theme.js` file. This approach avoids the runtime performance overhead of Tailwind parsing in React Native, keeps the bundle size smaller, and allows for extremely fine-grained control over complex gradient styling and colored shadow elevations that NativeWind struggles with.

---

## 🛠️ Getting Started

### Prerequisites
- **Python 3.10+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn**

### 1. Running the Backend
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
python main.py
```
*The API will be available at `http://localhost:8000`.*
*Interactive API Docs (Swagger UI) are available at `http://localhost:8000/docs`.*

### 2. Running the Frontend
Navigate to the frontend directory and start the Expo development server:
```bash
cd frontend
npm install
npm run web
```
*The React Native web app will be available at `http://localhost:8081`.*

---

## 🧪 Testing the API
We have provided a bash script to test the core backend endpoints. While the backend server is running, open a new terminal and execute:
```bash
cd backend
./curl_tests.sh
```
This script will:
1. Check API health.
2. Simulate an inbound WhatsApp enquiry.
3. Schedule a follow-up for that enquiry.
4. Escalate the enquiry.
5. Fetch the complete history and timeline of the enquiry.

---

## 📂 Repository Structure

```text
Closira/
├── backend/                  # Python FastAPI Backend
│   ├── app/                  # Application code
│   │   ├── api/              # Route handlers
│   │   ├── core/             # Config, DB, and Logging setup
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # Business logic and DB queries
│   │   └── tasks/            # Async background workers
│   ├── main.py               # Application entry point
│   └── curl_tests.sh         # End-to-end API test script
│
└── frontend/                 # React Native Mobile App
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── navigation/       # React Navigation setup
    │   ├── screens/          # Primary app views
    │   └── utils/            # Theme tokens and helpers
    ├── mock/                 # Local JSON data layer
    └── App.js                # App entry point
```

---
*Built with ❤️ for SMBs.*