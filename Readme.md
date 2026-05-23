# Closira Engineering Internship Assignment

> **Full-stack submission** — Backend REST API + Async Worker + React Native Mobile Dashboard

This is a complete, production-ready implementation of Closira's customer enquiry management system with a FastAPI backend and React Native mobile dashboard.

---

## Repository Structure

```
Assignment/
├── backend/          # FastAPI REST API + async SOP processing
│   ├── app/
│   │   ├── api/          # Route handlers (enquiry.py, health.py)
│   │   ├── core/         # Config, database, logging
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # Business logic (enquiry_service, sop_matcher)
│   │   └── tasks/        # Background task dispatcher
│   ├── main.py           # FastAPI app entry point
│   ├── curl_tests.sh     # Smoke test script
│   ├── requirements.txt
│   ├── README.md
│   └── .gitignore
│
├── frontend/         # React Native mobile dashboard (Expo)
│   ├── src/
│   │   ├── screens/      # 5 full screens
│   │   ├── components/   # Reusable component library
│   │   ├── navigation/   # Bottom tabs + stack navigator
│   │   ├── utils/        # Theme tokens, helpers
│   │   └── mock/         # Mock data index
│   ├── mock/             # Realistic mock JSON data
│   ├── App.js
│   ├── package.json
│   ├── README.md
│   └── .gitignore
│
├── README.md         # This file
└── .gitignore
```

---

## Getting Started

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate           # On Windows
# source venv/bin/activate      # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server starts at **http://localhost:8000**

- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

The SQLite database (`closira.db`) is created automatically on first run.

For complete backend documentation, see [backend/README.md](backend/README.md)

### Frontend

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or
yarn start
```

Follow the Expo CLI prompts to run on iOS (i), Android (a), or Web (w).

For complete frontend documentation, see [frontend/README.md](frontend/README.md)

---

### Running the Tests

**HTTP file** (VS Code REST Client extension):
```
Open backend/api_tests.http → click "Send Request" on each block
```

**curl script**:
```bash
chmod +x curl_tests.sh
./curl_tests.sh   # requires the server to be running and jq installed
```

---

### Database Schema

#### `enquiries` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID string (PK) | Generated on create |
| `customer_name` | VARCHAR(255) | Required |
| `channel` | ENUM | whatsapp / email / call |
| `message` | TEXT | Original inbound message |
| `status` | ENUM | pending → processing → open / escalated / follow_up / resolved |
| `matched_sop` | VARCHAR(100) | Set by background task |
| `suggested_response` | TEXT | Set by background task |
| `escalation_reason` | TEXT | Set on escalation |
| `followup_delay_minutes` | INT | Minutes from scheduled time |
| `followup_message_template` | TEXT | Optional template string |
| `followup_due_at` | DATETIME | Computed due time |
| `created_at` | DATETIME | UTC |
| `updated_at` | DATETIME | UTC, auto-updated |

#### `timeline_events` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID string (PK) | |
| `enquiry_id` | FK → enquiries | |
| `event_type` | VARCHAR(50) | e.g. enquiry_created, sop_matched, escalated |
| `description` | TEXT | Human-readable description |
| `metadata_json` | TEXT | JSON-encoded extra data |
| `created_at` | DATETIME | UTC |

**Design reasoning**: The timeline table is separate from the enquiry table to keep a clean append-only event log. This makes it easy to audit every state transition without overwriting history. Foreign key + ordered query (`ORDER BY created_at`) gives a reliable audit trail.

---

### Celery vs FastAPI BackgroundTasks — Decision

**Chosen: FastAPI BackgroundTasks**

**Rationale:**

FastAPI's built-in `BackgroundTasks` runs the task in the same process after the HTTP response is sent. For this assignment, it's the right call because:

1. **Zero infrastructure overhead** — No Redis broker, no worker process, no Celery Beat. The project runs with a single `uvicorn` command, which is a huge win for reviewability and local setup.

2. **The workload is lightweight** — SOP matching is pure Python keyword logic that completes in milliseconds. Celery's overhead (serialization, broker round-trip, worker process) would cost more than the task itself.

3. **All state is in the database** — We don't need Celery's result backend. The enquiry record in SQLite serves as the durable task result.

4. **The service layer is already decoupled** — `process_enquiry_sop()` in `enquiry_service.py` knows nothing about how it's invoked. Migrating to Celery in production means wrapping it in `@celery.task` — a 5-line change, not a refactor.

**When I'd switch to Celery:**
- Multi-tenant system with thousands of enquiries/minute requiring rate limiting per tenant
- Tasks that need retries with exponential back-off (e.g., calling an external AI API)
- Scheduled jobs (Celery Beat for follow-up reminder notifications)
- Fan-out workflows (one enquiry triggers multiple parallel tasks)

---

### SQLite vs PostgreSQL — Decision

**Chosen: SQLite (via aiosqlite for async support)**

**Rationale:** SQLite is perfect for a single-developer internship submission — zero setup, zero Docker required, the database is a single file. The `DATABASE_URL` setting in `app/core/config.py` means switching to PostgreSQL requires one environment variable change:

```bash
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/closira uvicorn app.main:app
```

SQLAlchemy's async abstraction makes this a zero-code-change migration.

---

### SOPs (Standard Operating Procedures)

Five hardcoded SOPs matched by keyword scoring:

| SOP | Keywords (sample) | Auto-escalate? |
|-----|-------------------|----------------|
| Booking Enquiry | book, schedule, appointment, slot | No |
| Pricing Question | price, cost, plan, how much, quote | No |
| Complaint / Issue | complaint, problem, refund, angry, frustrated | No |
| After-Hours Message | urgent, emergency, asap, tonight | No |
| General Information | what, how, feature, tell me, info | No |
| *(no match)* | — | **Yes** |

The scorer counts how many keywords from each SOP appear in the message (case-insensitive substring match). Highest score wins. Ties go to higher-priority SOPs (ordering in the list).

---

### Logging

All events are logged in structured JSON format to stdout:

```json
{"asctime": "2025-05-20T09:14:02", "name": "app.services.enquiry_service", "levelname": "INFO", "message": "Enquiry created", "enquiry_id": "3f7c...", "channel": "whatsapp", "customer": "Sarah M."}
{"asctime": "2025-05-20T09:14:03", "name": "app.services.enquiry_service", "levelname": "INFO", "message": "SOP matched", "enquiry_id": "3f7c...", "sop": "pricing_question"}
```

Key logged events: `enquiry_created`, `sop_matched`, `auto_escalated`, `followup_scheduled`, `escalated`, background task start/complete/error.

---

### Known Limitations & Trade-offs

- **No authentication** — Multi-tenant auth (JWT, API keys) would be added in production. The schema is "tenant-aware" in concept but the `tenant_id` column is not implemented.
- **SQLite concurrency** — SQLite's write lock would bottleneck at high concurrency. PostgreSQL + connection pooling (asyncpg) would handle this.
- **SOP matching is keyword-only** — Production Closira would use an LLM or embedding similarity. The `match_sop()` function interface is designed to be swapped without touching the task runner.
- **No retry logic** — If the background task crashes mid-processing, the enquiry stays in `processing` status. A Celery retry policy or a periodic "stuck task" sweeper would fix this.
- **Follow-up delivery is not implemented** — The follow-up due time is stored and surfaced in the API, but no actual message is sent (no WhatsApp/email integration).

---

## 2. Frontend Assignment

### Quick Start

```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Then press:
#   'a' for Android emulator
#   'i' for iOS simulator
#   'w' for web browser
```

Requires Node.js 18+ and the Expo Go app on your phone for physical device testing.

---

### Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `Home` (tab) | KPI stats, quick actions, activity feed |
| Leads | `Leads` (tab) | Filterable lead list with channel + status badges |
| Escalations | `Escalations` (tab) | Active escalations with urgency + resolve action |
| Follow-ups | `FollowUps` (tab) | Task cards with due times + mark-as-done |
| Conversation Detail | `ConversationDetail` (stack) | Message thread, SOP match, AI summary, timeline |

---

### Navigation Structure

```
Stack Navigator
└── MainTabs (Bottom Tab Navigator)
    ├── Home        → DashboardScreen
    ├── Leads       → LeadsScreen
    ├── Escalations → EscalationsScreen  [badge: open count]
    └── FollowUps   → FollowUpsScreen    [badge: due count]
    
    (ConversationDetail opens as a stack screen from Leads or Escalations)
```

---

### Styling Decision: StyleSheet over NativeWind

**Chosen: React Native `StyleSheet`**

**Rationale:**

1. **No build tooling required** — NativeWind requires a Babel plugin and Tailwind config. `StyleSheet` works out of the box with Expo, making the project easier to clone and run.

2. **Type safety at the component level** — Named style objects (`styles.card`, `styles.header`) are explicit and grep-able. Tailwind class strings are opaque strings that can silently fail.

3. **Design token system** — I built a `src/utils/theme.js` file with a consistent spacing scale, color palette, typography sizes, border radii, and shadow presets. This gives the same design consistency that Tailwind provides, without the toolchain dependency.

4. **Performance** — `StyleSheet.create()` validates styles at dev time and creates immutable references that perform better than inline objects.

I'd reach for NativeWind in a team setting where designers already work in Tailwind and cross-platform consistency with a web codebase matters.

---

### Component Structure

```
src/components/
├── common/
│   ├── ChannelBadge.js     → WhatsApp (green) / Email (blue) / Call (amber)
│   ├── StatusBadge.js      → New / Open / Escalated / Follow-up dots
│   ├── EmptyState.js       → Empty list with icon + message
│   └── SectionHeader.js    → Title + optional "See all" action
├── dashboard/
│   ├── StatCard.js         → Single KPI card
│   └── ActivityFeedItem.js → Activity feed row
├── leads/
│   └── LeadCard.js         → Tappable lead card with badges
├── escalations/
│   └── EscalationCard.js   → Urgency strip + resolve button
└── followups/
    └── FollowUpCard.js     → Due time + mark-as-done
```

Every screen composes from these building blocks. No monolithic screen files.

---

### Mock Data

Mock data lives in `/mock` and is structured exactly as an API response would look — field names, ISO 8601 timestamps, enum values. The barrel export in `mock/index.js` provides derived views (`MOCK_ESCALATIONS`, `MOCK_FOLLOWUPS`) that mirror what real API queries would return.

This makes the frontend API-ready: replacing `MOCK_ENQUIRIES` with a `useFetch('/enquiry')` hook requires no component changes.

---

### Known Limitations

- **No real API integration** — All data is hardcoded mock JSON as per the assignment requirements.
- **No push notifications** — Follow-up due-time alerts would use Expo Notifications in production.
- **No authentication screen** — Would be a stack screen before MainTabs in production.
- **Resolve/Done actions are local state only** — In production these would call `POST /enquiry/{id}/escalate` or a resolve endpoint.

---

## Video Walkthrough

*(Record a 2–5 minute screen recording covering:)*
- Backend: running the server, hitting all 5 endpoints via curl/REST Client, showing the /docs page
- Frontend: navigating all 4 tabs, opening a conversation detail, resolving an escalation, marking a follow-up done

---

## Questions?

Reach out as directed in the assignment brief.