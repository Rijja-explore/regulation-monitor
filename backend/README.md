# Evidence, Auditability & Trust Layer + Monitoring Agent

**Agentic AI-Enabled Continuous PCI/PII Compliance Platform**

## Overview

This backend provides:

### **Person 1: Evidence & Audit Trust Layer**
- ✅ Autonomous evidence generation
- ✅ Immutable hash-chained audit trail
- ✅ Human-readable explanations
- ✅ One-click audit bundle generation

### **Person 2: Monitoring & Violation Detection Agent** ⭐ NEW
- ✅ Real-time PCI-DSS PAN exposure detection
- ✅ Deterministic regex + Luhn validation
- ✅ Automatic evidence capture
- ✅ Violation persistence to JSON
- ✅ Frontend-ready REST APIs

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Monitoring Agent Demo (⭐ NEW)

```bash
./demo_monitoring_agent.sh
```

This complete demo will:
- Run unit tests
- Start the FastAPI server
- Execute API tests
- Show PAN detection in action
- Verify evidence capture
- Display persisted violations

### 3. Run the API Server

```bash
python -m api.main
```

Or using uvicorn directly:

```bash
uvicorn api.main:app --reload --port 8000
```

### 4. Access API Documentation

Open your browser to:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### ⭐ Monitoring Agent (NEW)

- `GET /monitor/health` - Health check for monitoring service
- `POST /monitor/ingest` - Ingest data for real-time PAN detection
- `GET /monitor/violations` - List all detected violations

### Evidence Management

- `POST /evidence/capture` - Capture new evidence
- `GET /evidence/{evidence_id}` - Get evidence by ID
- `GET /evidence` - List all evidence (optional date filter)

### Audit Trail

- `GET /audit/trail` - Get audit trail (hash chain)
- `GET /audit/verify` - Verify audit trail integrity

### Explanations

- `GET /explanation/{evidence_id}` - Get human-readable explanation

### Audit Bundles

- `POST /audit/generate-bundle` - Generate audit bundle ZIP

## Example Usage

### ⭐ NEW: Monitor for PAN Violations

```bash
# Ingest data (will detect PAN and create violation)
curl -X POST "http://localhost:8000/monitor/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "TICKET_142",
    "content": "My card is 4111 1111 1111 1111",
    "timestamp": "2026-01-05T00:00:00Z"
  }'

# List violations
curl "http://localhost:8000/monitor/violations"
```

### 1. Capture Evidence

```bash
curl -X POST "http://localhost:8000/evidence/capture" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "violation",
    "regulation": {
      "framework": "PCI-DSS",
      "clause": "3.2.1",
      "requirement": "PAN must be rendered unreadable"
    },
    "detection": {
      "detected_by": "Reflex Agent ID-7",
      "detection_method": "log_pattern",
      "confidence": 0.94
    },
    "violation_state": {
      "before": {"risk_score": 0.87},
      "after": {"risk_score": 0.12}
    },
    "remediation": {
      "agent_id": "RemediationAgent-1",
      "action_type": "mask_pan",
      "success": true
    },
    "reasoning_chain": {
      "steps": ["Step 1: Pattern matched", "Step 2: Validated", "Step 3: Remediated"]
    }
  }'
```

### 2. Get Evidence

```bash
curl "http://localhost:8000/evidence/EVID-1234567890-ABC123"
```

### 3. Get Explanation

```bash
curl "http://localhost:8000/explanation/EVID-1234567890-ABC123"
```

### 4. Verify Audit Trail

```bash
curl "http://localhost:8000/audit/verify"
```

### 5. Generate Audit Bundle

```bash
curl -X POST "http://localhost:8000/audit/generate-bundle?tenant_id=org_123&start_date=2024-01-01T00:00:00Z&end_date=2024-01-31T23:59:59Z" \
  --output audit_bundle.zip
```

## Project Structure

```
.
├── api/
│   └── main.py                 # FastAPI application
├── models/
│   ├── evidence.py             # EvidenceRecord model
│   ├── audit_chain.py          # AuditChainNode model
│   └── explanation.py          # Explanation model
├── services/
│   ├── evidence_service.py     # Evidence management
│   ├── audit_chain_service.py  # Hash-chained audit trail
│   ├── explanation_service.py  # Explanation generation
│   └── audit_bundle_service.py # Bundle generation
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Features

### 1. Evidence Generation

- Automatic evidence ID generation
- Structured evidence records
- Links to regulations, policies, controls
- Before/after state tracking

### 2. Immutable Audit Trail

- Hash-chained records
- Tamper-evident design
- Integrity verification
- Append-only structure

### 3. Explainability

- Natural language narratives
- Regulation context
- Agent reasoning traces
- Decision summaries

### 4. Audit Bundles

- ZIP archive with all evidence
- Hash chain export
- Verification reports
- Executive summary
- Human-readable formats

## Testing

### Using Python

```python
from services.evidence_service import EvidenceService
from services.audit_chain_service import AuditChainService
from models.evidence import EventType

# Initialize services
audit_chain_service = AuditChainService()
evidence_service = EvidenceService(audit_chain_service)

# Capture evidence
evidence = evidence_service.capture_evidence(
    event_type=EventType.VIOLATION,
    regulation={"framework": "PCI-DSS", "clause": "3.2.1"},
    detection={"detected_by": "Agent-1", "confidence": 0.94}
)

print(f"Evidence ID: {evidence.evidence_id}")

# Verify chain
verification = audit_chain_service.verify_chain()
print(f"Chain valid: {verification['valid']}")
```

## Development Notes

### Current Implementation

- **Evidence & Audit**: In-memory (Python dictionaries)
- **Monitoring Agent**: JSON file storage (`data/violations.json`)
- **For Production**: Replace with PostgreSQL/SQLAlchemy
- **Architecture**: Ready for database migration

### ⭐ NEW: Monitoring Agent Files

```
monitoring_agent/
├── __init__.py              # Package initialization
├── api.py                   # FastAPI routes (/monitor/*)
├── detectors.py             # PAN detection (regex + Luhn)
├── models.py                # Pydantic data models
├── evidence_client.py       # Evidence API HTTP client
├── store.py                 # JSON file persistence
├── README.md                # Technical documentation
└── QUICK_START.md           # Setup guide

data/
└── violations.json          # Violation storage (append-only)

test_monitoring_agent.py     # Unit tests for monitoring agent
test_api.sh                  # API integration tests
demo_monitoring_agent.sh     # Complete live demo script

MONITORING_AGENT_BUILD_SUMMARY.md   # Build summary
SYSTEM_ARCHITECTURE.md              # Architecture documentation
```

### Testing

```bash
# Unit tests
python test_monitoring_agent.py

# API integration tests
./test_api.sh

# Complete demo (recommended)
./demo_monitoring_agent.sh
```

### Database Migration (Future)

To migrate to PostgreSQL:

1. Update `EvidenceService` to use SQLAlchemy
2. Update `AuditChainService` to use SQLAlchemy
3. Update `ViolationStore` to use database table
4. Create database schema (see `db/schema.sql` if needed)
5. Add database connection pooling

### Production Considerations

- Add authentication/authorization
- Add rate limiting
- Add logging (structured logging)
- Add monitoring/metrics (Prometheus)
- Use Redis for caching
- Use S3 for audit trail archival
- Add background jobs for integrity checks
- Implement proper error handling
- Add retry logic for evidence capture
- Set up database backups

## Documentation

- **Main README**: This file
- **Monitoring Agent**: `monitoring_agent/README.md`
- **Quick Start**: `monitoring_agent/QUICK_START.md`
- **Build Summary**: `MONITORING_AGENT_BUILD_SUMMARY.md`
- **Architecture**: `SYSTEM_ARCHITECTURE.md`

## License

MIT
