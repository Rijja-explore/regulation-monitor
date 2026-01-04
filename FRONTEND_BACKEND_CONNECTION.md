# Frontend-Backend Connection Guide

## Overview
The React frontend (in `src/`) connects to the FastAPI backend (in `backend/`) to provide real-time compliance monitoring.

## Backend Setup

### Start the Backend Server
```powershell
cd backend
..\..venv\Scripts\Activate.ps1
python run.py
```

The backend will run on **http://localhost:8000**

### Backend API Endpoints
- `GET /` - System status
- `GET /health` - Health check
- `POST /monitor/ingest` - Detect violations in content
- `GET /monitor/violations` - List all violations
- `POST /agent/analyze/{violation_id}` - Analyze violation with LLM
- `GET /evidence/records` - Get evidence records
- `GET /audit/chain` - Get audit chain

## Frontend Setup

### Start the Frontend Development Server
```powershell
npm start
```

The frontend will run on **http://localhost:3000**

### API Configuration
The frontend connects to the backend via the API service at `src/services/api.js`.

Environment variables (`.env.local`):
```
REACT_APP_API_URL=http://localhost:8000
```

### CORS Configuration
The backend is configured to accept requests from:
- http://localhost:3000
- http://localhost:3001
- http://127.0.0.1:3000

## Testing the Connection

### 1. Verify Backend is Running
Open http://localhost:8000 in your browser. You should see:
```json
{
  "status": "operational",
  "service": "Autonomous Compliance AI for Visa",
  "tenant": "VISA"
}
```

### 2. Verify Frontend Connection
Open http://localhost:3000 and navigate to the Compliance Overview page.
- If connected: Shows live violations from backend
- If disconnected: Shows red banner "Backend API Disconnected"

### 3. Test Violation Detection
Go to "Violation Analysis" page and test with sample data:
- Click "PAN in Support Ticket" button
- The frontend will send the content to backend
- Backend will detect the violation and return results
- Results will appear on the page

## API Service Usage in Components

### Example: Fetching Violations
```javascript
import api from '../services/api';

// Inside a component
useEffect(() => {
  async function loadViolations() {
    try {
      const violations = await api.getViolations();
      setViolations(violations);
    } catch (error) {
      console.error('Failed to load violations:', error);
    }
  }
  loadViolations();
}, []);
```

### Example: Detecting Violations
```javascript
import api from '../services/api';

const handleAnalyze = async () => {
  try {
    const result = await api.detectViolation(content, 'SUPPORT_TICKET');
    console.log('Detection result:', result);
  } catch (error) {
    console.error('Detection failed:', error);
  }
};
```

## Troubleshooting

### Backend Not Starting
1. Ensure virtual environment is activated
2. Check that port 8000 is not in use
3. Verify all dependencies are installed: `pip install -r requirements_minimal.txt`

### Frontend Can't Connect to Backend
1. Verify backend is running on port 8000
2. Check browser console for CORS errors
3. Ensure `.env.local` has correct API URL
4. Clear browser cache and restart frontend dev server

### CORS Errors
If you see CORS errors in the browser console:
1. Verify backend CORS middleware in `backend/main_integrated.py`
2. Ensure frontend URL is in `allow_origins` list
3. Restart both frontend and backend servers

## Architecture

```
┌─────────────────────────┐
│   React Frontend        │
│   (Port 3000)          │
│                         │
│   - Compliance Overview │
│   - Violation Analysis  │
│   - Evidence           │
│   - Remediation        │
└───────────┬─────────────┘
            │
            │ HTTP/REST API
            │
┌───────────▼─────────────┐
│   FastAPI Backend       │
│   (Port 8000)          │
│                         │
│   - Monitoring Agent    │
│   - Cognitive Agent     │
│   - Evidence Layer     │
│   - Audit Layer        │
└─────────────────────────┘
```

## Key Files

### Frontend
- `src/services/api.js` - API client service
- `src/pages/ComplianceOverview.js` - Uses `api.getViolations()`
- `src/pages/ViolationAnalysis.js` - Uses `api.detectViolation()`
- `.env.local` - API URL configuration

### Backend
- `backend/run.py` - Server startup script
- `backend/main_integrated.py` - FastAPI app with CORS config
- `backend/monitoring_agent/api.py` - Violation detection endpoints
- `backend/cognitive_agent/api.py` - LLM reasoning endpoints
