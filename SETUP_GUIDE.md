# Closira - Complete Setup & Running Guide

## Project Status: ✅ COMPLETE & READY TO RUN

All files have been organized, dependencies installed, and the backend has been tested successfully.

---

## Directory Structure

```
Assignment/
├── backend/                    # FastAPI REST API
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── enquiry.py
│   │   │   ├── health.py
│   │   │   └── __init__.py
│   │   ├── core/              # Core utilities
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── logging.py
│   │   │   └── __init__.py
│   │   ├── models/            # Database models
│   │   │   ├── enquiry.py
│   │   │   └── __init__.py
│   │   ├── schemas/           # Request/Response schemas
│   │   │   ├── enquiry.py
│   │   │   └── __init__.py
│   │   ├── services/          # Business logic
│   │   │   ├── enquiry_service.py
│   │   │   ├── sop_matcher.py
│   │   │   └── __init__.py
│   │   ├── tasks/             # Background tasks
│   │   │   ├── sop_processor.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── main.py                # FastAPI app entry
│   ├── requirements.txt        # Python dependencies
│   ├── curl_tests.sh           # API tests
│   ├── README.md               # Backend documentation
│   └── .gitignore
│
├── frontend/                   # React Native (Expo)
│   ├── src/
│   │   ├── screens/           # 5 full screens
│   │   │   ├── DashboardScreen.js
│   │   │   ├── LeadsScreen.js
│   │   │   ├── EscalationsScreen.js
│   │   │   ├── FollowUpsScreen.js
│   │   │   └── ConversationDetailScreen.js
│   │   ├── components/        # Reusable components
│   │   │   ├── ActivityFeedItem.js
│   │   │   ├── ChannelBadge.js
│   │   │   ├── EscalationCard.js
│   │   │   ├── StatusBadge.js
│   │   │   ├── StatCard.js
│   │   │   ├── FollowUpCard.js
│   │   │   ├── LeadCard.js
│   │   │   ├── SectionHeader.js
│   │   │   ├── EmptyState.js
│   │   │   └── (component subdirectories)
│   │   ├── navigation/        # Navigation setup
│   │   │   └── AppNavigator.js
│   │   ├── utils/             # Utilities
│   │   │   ├── theme.js
│   │   │   ├── helpers.js
│   │   │   └── (organized by feature)
│   │   └── mock/              # Mock data
│   │       └── index.js
│   ├── mock/                  # JSON data files
│   │   ├── enquiries.json
│   │   └── stats.json
│   ├── App.js                 # Entry point
│   ├── package.json
│   ├── README.md               # Frontend documentation
│   └── .gitignore
│
├── README.md                  # Main documentation
└── .gitignore
```

---

## Quick Start

### 1. Run Backend API

```bash
cd backend

# Activate virtual environment (if not already activated)
.venv\Scripts\activate

# Start the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Server will start at:** http://localhost:8000

**Available endpoints:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

### 2. Run Frontend (in a new terminal)

```bash
cd frontend

# Install if needed (already done)
npm install

# Start Expo dev server
npm start
```

Then choose:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Press `e` to send link via email

---

## Testing

### Test Backend API

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Create Enquiry:**
```bash
curl -X POST http://localhost:8000/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "channel": "whatsapp",
    "message": "What are your pricing plans?"
  }'
```

**Automated Tests:**
```bash
cd backend
chmod +x curl_tests.sh
./curl_tests.sh
```

### Test Frontend

The frontend includes mock data, so it works without the backend running. To connect to real API:

1. Update API base URL in components where needed
2. Replace mock data calls with actual API calls
3. Handle loading and error states

---

## What Was Fixed

✅ **Project Structure**
- Separated into backend/ and frontend/ directories
- Organized code by feature (models, views, components, etc.)

✅ **File Organization**
- Python files moved to proper backend locations with correct naming (snake_case)
- JavaScript files moved to frontend with proper casing (camelCase)
- JSON data files in proper mock directories
- Configuration files in correct locations

✅ **Dependencies**
- Backend: All FastAPI, SQLAlchemy, and utilities installed
- Frontend: All React Native and Expo packages installed
- Python environment: Virtual environment configured

✅ **Database**
- SQLAlchemy models created
- Database initialization automatic on startup
- SQLite database created and tables initialized

✅ **API Implementation**
- All endpoints implemented and tested
- SOP matching works correctly
- Background task processing works

✅ **Documentation**
- Root README updated with new structure
- Backend README created
- Frontend README created
- Proper .gitignore files created

---

## Verification Checklist

- [x] Backend starts without errors
- [x] Health endpoint responds correctly
- [x] Enquiry creation works
- [x] SOP matching processes in background
- [x] Database tables created
- [x] Frontend dependencies installed
- [x] All files organized properly
- [x] Imports use correct paths
- [x] No circular dependencies

---

## Project Architecture

### Backend (FastAPI)
- **API Layer**: Route handlers in `/app/api/`
- **Service Layer**: Business logic in `/app/services/`
- **Data Layer**: SQLAlchemy ORM in `/app/models/`
- **Async Processing**: Background tasks via BackgroundTasks
- **Logging**: Structured JSON logging

### Frontend (React Native)
- **Screens**: 5 full-screen components
- **Components**: Reusable UI components
- **Navigation**: Bottom tabs + stack navigator
- **State Management**: Local state with hooks
- **Mock Data**: Realistic sample data for development

---

## Environment Setup

**Backend:**
- Python 3.13
- FastAPI 0.111.0
- SQLAlchemy 2.0.49 (with async support)
- Uvicorn server
- SQLite database

**Frontend:**
- Node.js v14+
- React Native 0.74.1
- Expo 51.0.0
- React Navigation 6.x

---

## Next Steps

1. **Start Backend:**
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend:** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

3. **Connect Frontend to Backend:** (optional, for real data)
   - Update API endpoints in components
   - Replace mock data with API calls

4. **Test Workflows:**
   - Create enquiries via API
   - View them in the app
   - Test all status transitions

---

## Support

For detailed information:
- **Backend docs**: See `backend/README.md`
- **Frontend docs**: See `frontend/README.md`
- **API docs**: Visit http://localhost:8000/docs when server running
