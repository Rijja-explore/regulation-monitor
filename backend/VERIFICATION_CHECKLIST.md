# ✅ MONITORING AGENT - VERIFICATION CHECKLIST

## Pre-Flight Checklist

Use this checklist before demo or deployment.

---

## 📦 File Structure

- [ ] `monitoring_agent/__init__.py` exists
- [ ] `monitoring_agent/api.py` exists (117 lines)
- [ ] `monitoring_agent/detectors.py` exists (84 lines)
- [ ] `monitoring_agent/models.py` exists (64 lines)
- [ ] `monitoring_agent/evidence_client.py` exists (34 lines)
- [ ] `monitoring_agent/store.py` exists (109 lines)
- [ ] `monitoring_agent/README.md` exists
- [ ] `monitoring_agent/QUICK_START.md` exists
- [ ] `data/violations.json` exists (initial structure)
- [ ] `test_monitoring_agent.py` exists
- [ ] `test_api.sh` exists (executable)
- [ ] `demo_monitoring_agent.sh` exists (executable)

---

## 🔌 Integration Points

- [ ] `api/main.py` imports `monitoring_agent.api`
- [ ] `api/main.py` includes monitoring router
- [ ] `requirements.txt` includes `httpx`
- [ ] Evidence service is callable at `/evidence/capture`

---

## 🧪 Testing

### Unit Tests
- [ ] `python test_monitoring_agent.py` runs without errors
- [ ] PANDetector tests pass
- [ ] ViolationObject creation works
- [ ] ViolationStore tests pass
- [ ] End-to-end integration test passes

### API Tests
- [ ] Server starts: `uvicorn api.main:app --reload`
- [ ] Health check returns 200: `curl http://localhost:8000/monitor/health`
- [ ] Ingest endpoint accepts POST: `curl -X POST http://localhost:8000/monitor/ingest`
- [ ] Violations endpoint returns data: `curl http://localhost:8000/monitor/violations`
- [ ] `./test_api.sh` runs successfully

---

## 🔍 Detection Logic

### Valid PAN Detection
- [ ] Detects: `4111 1111 1111 1111` (spaces)
- [ ] Detects: `4111-1111-1111-1111` (dashes)
- [ ] Detects: `4111111111111111` (no separators)
- [ ] Detects: `5555555555554444` (Mastercard)

### Masked PAN Handling
- [ ] Ignores: `**** **** **** 1111`
- [ ] Ignores: `****-****-****-1111`

### Invalid PAN Rejection
- [ ] Rejects: `1234 5678 9012 3456` (invalid Luhn)
- [ ] Rejects: Random 16-digit sequences

---

## 💾 Data Persistence

- [ ] `data/violations.json` is created on first violation
- [ ] Violations are appended (not overwritten)
- [ ] Each violation has unique `violation_id`
- [ ] Each violation has `evidence_id` from evidence service
- [ ] Timestamps are in ISO-8601 format
- [ ] Tenant ID is set to "visa"

---

## 🔗 Evidence Integration

- [ ] Violation triggers call to `/evidence/capture`
- [ ] Evidence ID is returned successfully
- [ ] Evidence ID is stored in violation record
- [ ] Evidence can be retrieved via `/evidence/{evidence_id}`
- [ ] Evidence appears in audit chain

---

## 📊 API Responses

### POST /monitor/ingest (with PAN)
- [ ] Returns `status: "violation_detected"`
- [ ] Includes `violation_id`
- [ ] Includes `evidence_id`
- [ ] Includes `severity: "Critical"`

### POST /monitor/ingest (no PAN)
- [ ] Returns `status: "no_violation"`
- [ ] Includes `source_id`
- [ ] No error thrown

### GET /monitor/violations
- [ ] Returns `count` field
- [ ] Returns `tenant_id: "visa"`
- [ ] Returns array of violations
- [ ] Each violation has all required fields

---

## 🎯 Functional Requirements

### Ingestion
- [ ] Accepts `source_type` (transaction, log, chat, message)
- [ ] Accepts `source_id`
- [ ] Accepts `content` (text to scan)
- [ ] Accepts `timestamp` (ISO-8601)
- [ ] Validates input with Pydantic

### Detection
- [ ] Uses regex for pattern matching
- [ ] Validates with Luhn algorithm
- [ ] Ignores masked patterns
- [ ] Sub-millisecond performance

### Violation Creation
- [ ] Creates ViolationObject
- [ ] Includes regulation info (PCI-DSS)
- [ ] Includes detection info
- [ ] Includes violation state (before)
- [ ] Includes metadata (severity, tenant_id)

### Evidence Capture
- [ ] Calls POST `/evidence/capture`
- [ ] Sends complete violation object
- [ ] Receives evidence_id
- [ ] Handles errors gracefully

### Storage
- [ ] Persists to JSON file
- [ ] Generates unique violation IDs
- [ ] Appends without overwriting
- [ ] Thread-safe (for demo purposes)

---

## 📝 Documentation

- [ ] README.md updated with monitoring agent info
- [ ] QUICK_START.md provides setup instructions
- [ ] API endpoints documented
- [ ] Code comments are clear
- [ ] Examples provided

---

## 🚀 Demo Readiness

### Manual Testing
- [ ] Start server manually
- [ ] Send test violation via curl
- [ ] Verify violation appears in `/monitor/violations`
- [ ] Verify evidence appears in `/evidence`
- [ ] Check `data/violations.json` file

### Automated Demo
- [ ] `./demo_monitoring_agent.sh` runs without errors
- [ ] All tests pass
- [ ] Server starts successfully
- [ ] Violations are detected
- [ ] Evidence is captured
- [ ] Clean output (no stack traces)

---

## 🎓 Judge Presentation

### Key Points to Highlight
- [ ] Real-time detection (sub-millisecond)
- [ ] Deterministic (no AI/LLM needed)
- [ ] Explainable (regex + Luhn)
- [ ] Tamper-evident (evidence chain)
- [ ] Production-ready architecture
- [ ] Complete test coverage

### Demo Flow
- [ ] Show health check
- [ ] Ingest data with PAN
- [ ] Show violation detected
- [ ] List all violations
- [ ] Show evidence in audit trail
- [ ] Display violations.json file

---

## 🔧 Troubleshooting

### Common Issues
- [ ] Port 8000 in use → Use different port
- [ ] Import errors → Check PYTHONPATH
- [ ] httpx not found → Run `pip install -r requirements.txt`
- [ ] Server won't start → Check logs in /tmp/monitoring_server.log

### Pre-Demo Checklist
- [ ] Fresh install of dependencies
- [ ] Clear `data/violations.json` if needed
- [ ] Kill any running servers on port 8000
- [ ] Test internet connection (for evidence capture)
- [ ] Have backup curl commands ready

---

## ✅ Final Verification

Run this command to verify everything:

```bash
cd backend
./demo_monitoring_agent.sh
```

Expected outcome:
- ✅ All unit tests pass
- ✅ Server starts
- ✅ Health check returns 200
- ✅ PAN detection works
- ✅ Evidence is captured
- ✅ Violations are persisted
- ✅ No errors in output

---

## 🎉 Sign-Off

- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Demo script tested
- [ ] Ready for judges

**Signed off by:** _______________

**Date:** _______________

**Status:** 🟢 READY FOR DEMO
