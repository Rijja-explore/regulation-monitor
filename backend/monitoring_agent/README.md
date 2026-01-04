# Monitoring & Violation Detection Agent

## Overview

Real-time PCI-DSS PAN exposure detection agent for the Agentic AI-Enabled Continuous PCI/PII Compliance Platform.

## What It Does

- **Ingests** operational data (logs, transactions, chats, messages)
- **Detects** unmasked PAN (Primary Account Number) violations using deterministic regex + Luhn validation
- **Creates** structured violation events
- **Captures** tamper-evident evidence via `/evidence/capture` API
- **Persists** violations to `data/violations.json`
- **Exposes** APIs for frontend consumption

## Architecture

```
monitoring_agent/
├── __init__.py
├── api.py              # FastAPI routes
├── detectors.py        # PAN detection engine
├── models.py           # Pydantic data models
├── evidence_client.py  # Evidence capture HTTP client
└── store.py            # JSON file persistence
```

## API Endpoints

### 1. Health Check
```
GET /monitor/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Monitoring & Violation Detection Agent",
  "version": "1.0.0",
  "capabilities": ["PCI-DSS PAN Detection"]
}
```

### 2. Ingest Data
```
POST /monitor/ingest
```

**Request:**
```json
{
  "source_type": "support_chat",
  "source_id": "TICKET_142",
  "content": "My card number is 4111 1111 1111 1111",
  "timestamp": "2026-01-04T18:45:00Z"
}
```

**Response (Violation Detected):**
```json
{
  "status": "violation_detected",
  "violation_id": "VIOL-001-ABC123",
  "evidence_id": "EVID-1735989000-DEF456",
  "severity": "Critical",
  "message": "PAN exposure detected and evidence captured"
}
```

**Response (No Violation):**
```json
{
  "status": "no_violation",
  "message": "No PAN exposure detected",
  "source_id": "TICKET_142"
}
```

### 3. List Violations
```
GET /monitor/violations
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

## PAN Detection Logic

### Pattern Matching
- Detects 16-digit sequences with optional spaces/dashes
- Examples: `4111111111111111`, `4111-1111-1111-1111`, `4111 1111 1111 1111`

### Validation
- **Luhn Check**: Validates card number checksum
- **Masked Pattern Exclusion**: Ignores `**** **** **** 1234` format

### No False Positives
- Only flags valid card numbers
- Deterministic, explainable detection

## Data Flow

```
1. POST /monitor/ingest
   ↓
2. PAN Detection (regex + Luhn)
   ↓
3. Create ViolationObject
   ↓
4. POST /evidence/capture → Get evidence_id
   ↓
5. Save to data/violations.json
   ↓
6. Return response to client
```

## Storage

### File: `data/violations.json`

```json
{
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
      "timestamp": "2026-01-04T18:45:01.000Z"
    }
  ]
}
```

## Integration

This agent is integrated into the main FastAPI application:

```python
from monitoring_agent.api import router as monitoring_router

app = FastAPI(...)
app.include_router(monitoring_router)
```

## Technical Constraints

- ✅ **No LLM** - Pure deterministic detection
- ✅ **No Database** - JSON file storage
- ✅ **Single Tenant** - `tenant_id: "visa"`
- ✅ **Single Regulation** - PCI-DSS PAN Exposure only
- ✅ **Fast & Reliable** - Regex-based, instant detection

## Demo Scenario

```bash
# 1. Start server
cd backend
uvicorn api.main:app --reload

# 2. Send test data
curl -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "TICKET_142",
    "content": "My card is 4111 1111 1111 1111",
    "timestamp": "2026-01-04T18:45:00Z"
  }'

# 3. List violations
curl http://localhost:8000/monitor/violations
```

## Success Criteria

✅ PAN appears in input text  
✅ Violation is detected instantly  
✅ Evidence is captured via `/evidence/capture`  
✅ Violation is persisted to `violations.json`  
✅ Frontend can list the violation  

## One-Line Description

**"This monitoring agent continuously inspects live operational data and deterministically detects PCI-DSS violations, creating tamper-evident compliance evidence in real time."**
