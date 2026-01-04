# Monitoring Agent - Quick Start Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
uvicorn api.main:app --reload
```

Server will start at: `http://localhost:8000`

### 3. Verify Installation

```bash
curl http://localhost:8000/monitor/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Monitoring & Violation Detection Agent",
  "version": "1.0.0",
  "capabilities": ["PCI-DSS PAN Detection"]
}
```

## 🧪 Run Tests

### Unit Tests
```bash
cd backend
python test_monitoring_agent.py
```

### API Tests
```bash
cd backend
./test_api.sh
```

## 📡 API Examples

### Detect PAN Violation

```bash
curl -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "TICKET_142",
    "content": "My card is 4111 1111 1111 1111",
    "timestamp": "2026-01-04T18:45:00Z"
  }'
```

**Response:**
```json
{
  "status": "violation_detected",
  "violation_id": "VIOL-001-ABC123",
  "evidence_id": "EVID-1735989000-DEF456",
  "severity": "Critical",
  "message": "PAN exposure detected and evidence captured"
}
```

### List Violations

```bash
curl http://localhost:8000/monitor/violations
```

**Response:**
```json
{
  "count": 1,
  "tenant_id": "visa",
  "violations": [
    {
      "violation_id": "VIOL-001-ABC123",
      "evidence_id": "EVID-1735989000-DEF456",
      "source_type": "support_chat",
      "source_id": "TICKET_142",
      "severity": "Critical",
      "regulation": "PCI-DSS",
      "description": "PAN exposed in plaintext",
      "timestamp": "2026-01-04T18:45:01Z"
    }
  ]
}
```

## 📂 File Structure

```
backend/
├── monitoring_agent/
│   ├── __init__.py
│   ├── api.py              # FastAPI routes
│   ├── detectors.py        # PAN detection engine
│   ├── models.py           # Pydantic models
│   ├── evidence_client.py  # Evidence capture client
│   ├── store.py            # JSON persistence
│   └── README.md           # Detailed documentation
├── data/
│   └── violations.json     # Violation storage
├── api/
│   └── main.py             # Main FastAPI app (updated)
├── test_monitoring_agent.py  # Unit tests
├── test_api.sh               # API integration tests
└── requirements.txt          # Dependencies (updated)
```

## 🔍 What Gets Detected

### ✅ DETECTED (Violations)
- `4111 1111 1111 1111` (spaces)
- `4111-1111-1111-1111` (dashes)
- `4111111111111111` (no separators)
- `5555555555554444` (Mastercard format)

### ❌ NOT DETECTED (Safe)
- `**** **** **** 1111` (masked)
- `1234 5678 9012 3456` (invalid Luhn)
- `Regular text without PANs`

## 🔗 Integration Points

### Evidence Capture
Every detected violation calls:
```
POST /evidence/capture
```

This creates tamper-evident audit records in the Evidence & Audit Trust Layer.

### Violation Storage
All violations are persisted to:
```
backend/data/violations.json
```

### Frontend Integration
Frontend can query:
```
GET /monitor/violations
```

## 🎯 Demo Flow

1. **Start Server**: `uvicorn api.main:app --reload`
2. **Send Test Data**: Use `test_api.sh` or curl commands
3. **Check Violations**: `curl http://localhost:8000/monitor/violations`
4. **Inspect Evidence**: `curl http://localhost:8000/evidence`
5. **View JSON File**: `cat data/violations.json`

## ⚙️ Configuration

### Tenant ID
Hardcoded as `"visa"` (single-tenant MVP)

### Detection Engine
- **Method**: Regex + Luhn validation
- **No LLM**: Deterministic, explainable
- **Fast**: Sub-millisecond detection

### Storage
- **Format**: JSON file
- **Location**: `data/violations.json`
- **Append-only**: No overwrites

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn api.main:app --reload --port 8001
```

### Module Import Errors
```bash
# Make sure you're in the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run from backend directory
python -m uvicorn api.main:app --reload
```

### No Violations Detected
- Verify PAN is valid (use test card: `4111 1111 1111 1111`)
- Check timestamp format (ISO-8601)
- Ensure content is not masked

## 📊 Test Card Numbers

Use these for testing (they pass Luhn validation):

- Visa: `4111 1111 1111 1111`
- Mastercard: `5555 5555 5555 4444`
- Amex: Not supported (15 digits, only 16-digit PANs detected)

## 🎓 Key Concepts

### PAN (Primary Account Number)
The 16-digit card number that must NEVER appear in plaintext per PCI-DSS.

### Luhn Algorithm
Mathematical checksum validation for card numbers. Ensures we don't flag random 16-digit sequences.

### Evidence Chain
Each violation creates an immutable evidence record linked via cryptographic hash chain.

### Tenant Isolation
All data tagged with `tenant_id: "visa"` for audit separation.

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] PAN detection works (test with `4111 1111 1111 1111`)
- [ ] Violations persist to JSON file
- [ ] Evidence capture API is called
- [ ] GET /monitor/violations returns data
- [ ] Masked PANs are ignored
- [ ] Invalid PANs are rejected

## 🏁 Demo Script

```bash
# Terminal 1: Start server
cd backend
uvicorn api.main:app --reload

# Terminal 2: Run tests
cd backend
./test_api.sh

# Check results
cat data/violations.json
```

## 📝 Notes

- This is an MVP for hackathon demonstration
- Production would use proper database
- Single regulation only (PCI-DSS PAN exposure)
- No remediation implemented (out of scope)
- Frontend integration ready via REST API
