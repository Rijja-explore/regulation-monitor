# Autonomous Compliance AI for Visa

## 🎯 Project Brief

**Autonomous Compliance AI for Visa** is an agentic AI-powered continuous compliance platform that:
- **Continuously monitors** operational data for PCI-DSS violations
- **Detects** Primary Account Number (PAN) exposure in real-time
- **Reasons** over regulatory requirements using LLM-driven intelligence (via OpenRouter)
- **Automatically generates** audit-ready evidence with tamper-evident hash chains
- **Presents** compliance posture through an interactive React dashboard

**Unlike traditional manual compliance systems**, this solution treats compliance as an **autonomous, goal-driven intelligence process** with:
- ✅ Real-time monitoring
- ✅ Explainable AI decisions
- ✅ Tamper-evident audit trails
- ✅ Model-agnostic LLM architecture

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React UI)                         │
│  • Real-time Dashboard  • Violation Analysis  • Audit Trails   │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────────┐
│                   BACKEND (FastAPI)                             │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │ Monitoring Agent│  │ Cognitive Agent  │  │ Evidence Layer ││
│  │  (Reflex)       │  │  (LLM-Powered)   │  │ (Trust Layer)  ││
│  │                 │  │                  │  │                ││
│  │ • PAN Detection │──│ • Reasoning via  │──│ • Evidence     ││
│  │   (Regex)       │  │   OpenRouter     │  │   Capture      ││
│  │ • Real-time     │  │ • Autonomy       │  │ • Hash Chain   ││
│  │   Scanning      │  │   Decisions      │  │ • Audit Export ││
│  └─────────────────┘  └──────────────────┘  └────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Audit Layer (Verification)                   │  │
│  │  • Hash chain integrity  • Tamper detection              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Data Storage (JSON Files - No DB Required)        │  │
│  │  • violations.json  • evidence.json                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Agent Roles (Team of 4)

### 1. **Monitoring / Reflex Agent** 👁️
**Owner:** Engineer 1  
**Responsibility:** Real-time violation detection  
- Scans incoming data for PAN exposure (PCI-DSS)
- Uses deterministic regex patterns (no LLM)
- Triggers evidence capture on detection
- **Tech:** FastAPI, Python regex

### 2. **Cognitive Compliance Agent** 🧠
**Owner:** Engineer 2  
**Responsibility:** Intelligent reasoning and decision-making  
- Powered via **OpenRouter** (model-agnostic LLM routing)
- Supports Claude, GPT, and other frontier models
- Explains **WHY** something is a violation
- Decides remediation strategy and autonomy level
- **Tech:** OpenRouter API, structured JSON outputs

### 3. **Evidence & Audit Trust Layer** 📜
**Owner:** Engineer 3  
**Responsibility:** Evidence generation and auditability  
- Captures tamper-evident evidence records
- Implements hash-chained audit trail
- Generates audit bundles for regulators
- **Tech:** FastAPI, SHA-256 hashing

### 4. **Frontend UI** 🎨
**Owner:** Engineer 4  
**Responsibility:** User interface and visualization  
- Real-time compliance dashboard
- Violation analysis and remediation view
- Audit trail exploration
- **Tech:** React, TailwindCSS, Recharts

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 16+
- OpenRouter API key (optional for production LLM)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements_minimal.txt

# Create .env file (optional - works without for demo)
echo "OPENROUTER_API_KEY=your_key_here" > .env
echo "OPENROUTER_MODEL=anthropic/claude-sonnet-4" >> .env

# Run backend server
python -m uvicorn main_integrated:app --reload --port 8000
```

**Backend will be available at:** http://localhost:8000

### Frontend Setup

```bash
# Navigate to frontend
cd ../

# Install dependencies
npm install

# Start React dev server
npm start
```

**Frontend will be available at:** http://localhost:3000

---

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root health check |
| `GET` | `/health` | System health status |

### Monitoring Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/monitor/ingest` | Ingest data for violation detection |
| `GET` | `/monitor/violations` | List all detected violations |

### Cognitive Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/agent/reason` | Get LLM reasoning about violation |
| `POST` | `/agent/remediate` | Execute autonomous remediation |
| `GET` | `/agent/agent-activity` | Get agent activity log |

### Evidence Layer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/evidence/capture` | Capture new evidence record |
| `GET` | `/evidence` | List all evidence records |
| `GET` | `/evidence/{id}` | Get specific evidence |

### Audit Layer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/audit/trail` | Get hash-chained audit trail |
| `GET` | `/audit/verify` | Verify trail integrity |
| `GET` | `/explanation/{evidence_id}` | Get AI explanation |

---

## 🎬 Demo Flow (End-to-End)

### 1. Ingest Sensitive Data
```bash
curl -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "chat_001",
    "content": "Customer card: 4111 1111 1111 1111",
    "timestamp": "2026-01-05T10:00:00Z"
  }'
```

**Response:**
```json
{
  "status": "violation_detected",
  "violation_id": "viol_abc123",
  "evidence_id": "ev_xyz789",
  "severity": "Critical"
}
```

### 2. Get LLM Reasoning
```bash
curl -X POST http://localhost:8000/agent/reason \
  -H "Content-Type: application/json" \
  -d '{
    "violation_id": "viol_abc123",
    "violation_type": "PAN_DETECTED",
    "content": "Customer card: 4111 1111 1111 1111",
    "source": "support_chat"
  }'
```

**Response:**
```json
{
  "is_violation": true,
  "explanation": "PCI-DSS prohibits plaintext PAN storage...",
  "risk_severity": "Critical",
  "recommended_action": "Mask PAN immediately",
  "autonomy_level": "AUTONOMOUS",
  "confidence_score": 0.95
}
```

### 3. View in UI
- Open http://localhost:3000
- Navigate to **Compliance Overview**
- See violation appear in real-time
- Click violation to see AI reasoning
- View audit trail for verification

---

## 🏢 Technical Specifications

### Fixed Constraints
- **Organization:** VISA
- **Tenant ID:** `visa`
- **Regulation Scope:** PCI-DSS (PAN exposure only)
- **Storage:** JSON files (no database)
- **Backend Framework:** FastAPI
- **Language:** Python
- **LLM Access:** OpenRouter (model-agnostic)
- **Frontend:** React + TailwindCSS

### Why OpenRouter?
✅ **Model-agnostic:** Switch between Claude, GPT, Gemini without code changes  
✅ **No vendor lock-in:** Not tied to single LLM provider  
✅ **Enterprise-ready:** Routing layer for optimal model selection  
✅ **Cost-effective:** Choose best price-performance ratio  
✅ **Future-proof:** New models available immediately  

---

## 📂 Backend Structure

```
backend/
├── main_integrated.py          # FastAPI entry point
├── requirements_minimal.txt    # Python dependencies
│
├── monitoring_agent/           # Reflex Agent
│   ├── api.py                 # FastAPI routes
│   ├── detectors.py           # PAN detection logic
│   ├── models.py              # Pydantic schemas
│   └── file_store.py          # JSON storage
│
├── cognitive_agent/            # LLM Agent
│   ├── api.py                 # FastAPI routes
│   ├── reasoner_openrouter.py # OpenRouter integration
│   ├── schemas.py             # Pydantic models
│   └── prompts/
│       └── reasoning.txt      # LLM prompt template
│
├── evidence_layer/             # Trust Layer
│   ├── api.py                 # FastAPI routes
│   ├── models.py              # Evidence schemas
│   └── store.py               # Evidence storage
│
├── audit_layer/                # Audit Layer
│   ├── api.py                 # FastAPI routes
│   ├── hash_chain.py          # Hash chain logic
│   └── verify.py              # Integrity verification
│
└── data/                       # Data Storage
    ├── violations.json         # Violation records
    └── evidence.json           # Evidence records
```

---

## 🎯 Success Criteria

This integration is successful if:

✅ `uvicorn main_integrated:app` runs without errors  
✅ UI loads data from backend  
✅ Violations appear in UI  
✅ Evidence & audit trail are visible  
✅ Demo can be shown without explaining hacks  

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.12+

# Install dependencies
pip install -r requirements_minimal.txt

# Run from correct directory
cd backend
python -m uvicorn main_integrated:app --reload
```

### Frontend can't connect
```bash
# Check CORS settings in main_integrated.py
# Ensure frontend URL is in allow_origins list

# Verify backend is running
curl http://localhost:8000/health
```

### No violations appearing
```bash
# Check data directory exists
ls data/

# Check violations.json is writable
cat data/violations.json

# Test ingest endpoint directly
curl -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{"source_type":"test","source_id":"1","content":"4111111111111111","timestamp":"2026-01-05T10:00:00Z"}'
```

---

## 📝 License

Built for VISA-focused hackathon at IIT Madras, January 2026.  
For educational and demonstration purposes.

---

## 👥 Team

- **Engineer 1:** Monitoring Agent (Reflex Layer)
- **Engineer 2:** Cognitive Agent (LLM Reasoning)
- **Engineer 3:** Evidence & Audit Layer (Trust)
- **Engineer 4:** Frontend UI (Visualization)

---

## 🔗 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenRouter API](https://openrouter.ai/)
- [PCI-DSS Standards](https://www.pcisecuritystandards.org/)
- [React Documentation](https://react.dev/)

---

**Made with ❤️ for secure, autonomous compliance**
