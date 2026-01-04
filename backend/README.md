# Regulatory Intelligence & RAG API

## 🎯 Overview

FastAPI backend service providing **Regulatory Knowledge Base with RAG** for the Agentic Compliance Platform.

This module ingests regulatory documents (PCI-DSS, GDPR, CCPA, internal policies), extracts structured compliance obligations, and exposes them via clean APIs for autonomous agents.

---

## 🏗️ Architecture

```
backend/
├── main.py                          # FastAPI application entry point
├── requirements.txt                 # Python dependencies
├── .env.example                     # Environment configuration template
│
├── app/
│   ├── models/
│   │   └── schemas.py              # Pydantic request/response models
│   │
│   ├── services/
│   │   ├── rag_service.py          # Vector store & RAG query engine
│   │   ├── ingestion_service.py    # Document parsing & chunking
│   │   └── obligation_extractor.py # LLM-driven obligation extraction
│   │
│   └── data/
│       └── mock_regulations.py     # Sample PCI-DSS, GDPR, CCPA text
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env if needed (optional for demo)
```

### 3. Run the Server

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

### 4. Test the API

Visit: http://localhost:8000/docs

Auto-generated interactive API documentation (Swagger UI)

---

## 📡 API Endpoints

### Health Check
```http
GET /
```

**Response:**
```json
{
  "status": "operational",
  "service": "Regulatory Intelligence & RAG",
  "version": "1.0.0",
  "total_obligations": 42
}
```

---

### Query Regulations (RAG)
```http
POST /regulations/query
```

**Request:**
```json
{
  "question": "Is PAN allowed in application logs?",
  "top_k": 5
}
```

**Response:**
```json
{
  "answer": "No. PCI-DSS 3.2.1 prohibits storage of PAN in logs.",
  "obligations": ["PCI_DSS_3_2_1_PROHIBIT_PAN"],
  "confidence": 0.94,
  "sources": [
    {
      "regulation": "PCI-DSS",
      "section": "3.2.1",
      "content": "Primary Account Number (PAN) must not be stored...",
      "relevance": 0.92
    }
  ]
}
```

---

### Ingest Documents
```http
POST /regulations/ingest
```

**Request:**
```json
{
  "source": "PCI-DSS-4.0",
  "content": "Requirement 3: Protect stored cardholder data...",
  "metadata": {
    "regulation": "PCI-DSS",
    "version": "4.0"
  }
}
```

**Response:**
```json
{
  "source": "PCI-DSS-4.0",
  "chunks_created": 15,
  "obligations_extracted": 8,
  "status": "success",
  "message": "Ingested 15 chunks with 8 obligations"
}
```

---

### Get All Obligations
```http
GET /regulations/obligations?regulation=PCI-DSS&severity=CRITICAL
```

**Response:**
```json
{
  "total": 12,
  "obligations": [
    {
      "obligation_id": "PCI_DSS_3_2_1_PROHIBIT_PAN",
      "regulation": "PCI-DSS",
      "section": "3.2.1",
      "description": "PAN must not be stored or transmitted in logs, chats, transactions.",
      "data_types": ["PAN"],
      "applies_to": ["logs", "chats", "transactions"],
      "severity": "CRITICAL",
      "confidence": 0.85,
      "jurisdiction": "Global",
      "effective_date": "2024-01-01"
    }
  ]
}
```

---

### Get Statistics
```http
GET /regulations/statistics
```

**Response:**
```json
{
  "total_chunks": 156,
  "total_obligations": 42,
  "obligations_by_regulation": {
    "PCI-DSS": 18,
    "GDPR": 12,
    "CCPA": 6,
    "INTERNAL": 6
  },
  "obligations_by_severity": {
    "CRITICAL": 12,
    "HIGH": 15,
    "MEDIUM": 10,
    "LOW": 5
  },
  "embedding_dimension": 384,
  "vector_store": "ChromaDB"
}
```

---

## 🧠 How It Works

### 1. Document Ingestion Pipeline

```python
# Automatic on startup - loads mock regulations
await ingestion_service.ingest_mock_regulations()

# Manual ingestion
await ingestion_service.ingest_document(
    source="PCI-DSS-4.0",
    content=full_text,
    metadata={"regulation": "PCI-DSS"}
)
```

**Process:**
1. Text chunking (500 chars with 100 char overlap)
2. Section/article extraction via regex
3. Metadata enrichment
4. Vector embedding generation
5. Storage in ChromaDB

---

### 2. Obligation Extraction

**Rule-Based Approach (MVP):**
- Detects prohibition patterns: "must not", "prohibited", "cannot"
- Detects requirement patterns: "must be masked", "shall be encrypted"
- Extracts data types: PAN, CVV, PII, SSN
- Extracts contexts: logs, chats, transactions, storage
- Determines severity: CRITICAL, HIGH, MEDIUM, LOW

**Example:**
```python
Input: "PAN must not be stored in logs or customer communications"

Output:
{
  "obligation_id": "PCI_DSS_3_2_1_PROHIBIT_PAN",
  "description": "PAN must not be stored in logs, chats",
  "data_types": ["PAN"],
  "applies_to": ["logs", "chats"],
  "severity": "CRITICAL"
}
```

**LLM-Ready:**
- Prompt template included in `obligation_extractor.py`
- Swap rule-based logic with Claude/GPT API call
- Structured JSON output enforced via prompting

---

### 3. Vector Store & RAG

**Embedding Model:** `all-MiniLM-L6-v2` (384 dimensions)
**Vector DB:** ChromaDB (in-memory for demo)

**Query Flow:**
1. User asks: *"What regulations govern PAN storage?"*
2. Question embedded → vector
3. Similarity search → top 5 relevant chunks
4. Context + question → answer generation
5. Return answer + source obligations

**Answer Generation:**
- Rule-based for MVP (pattern matching)
- Can be replaced with LLM completion
- Returns confidence score based on vector distance

---

## 🔗 Integration with Other Agents

### Monitoring Agent
```python
# Agent detects PAN in chat log
response = await query_regulations(
    question="Is PAN allowed in support chats?"
)

if response.obligations:
    # Trigger violation alert
    violation_handler.flag(response.obligations[0])
```

### Remediation Agent
```python
# Get applicable obligations
obligations = await get_obligations(
    regulation="PCI-DSS",
    data_type="PAN"
)

for obligation in obligations:
    if obligation.severity == "CRITICAL":
        # Execute remediation
        remediate(obligation)
```

### Dashboard
```python
# Display regulatory statistics
stats = await get_statistics()

# Show compliance status
obligations = await get_obligations(severity="CRITICAL")
```

---

## 📦 Data Models

### Obligation Schema
```python
{
  "obligation_id": str,        # Unique ID
  "regulation": str,            # PCI-DSS, GDPR, etc.
  "section": str,               # 3.2.1, Article 17, etc.
  "description": str,           # Human-readable
  "data_types": List[str],      # [PAN, PII, CVV]
  "applies_to": List[str],      # [logs, chats, transactions]
  "severity": str,              # CRITICAL, HIGH, MEDIUM, LOW
  "confidence": float,          # 0.0 - 1.0
  "jurisdiction": str,          # Global, EU, California
  "effective_date": str         # ISO date
}
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | FastAPI 0.109 |
| **Vector DB** | ChromaDB 0.4.22 |
| **Embeddings** | sentence-transformers 2.3.1 |
| **LLM (optional)** | Anthropic Claude / OpenAI GPT |
| **Document Parsing** | PyPDF2, python-docx |
| **Validation** | Pydantic 2.5 |

---

## 🧪 Testing

### Test RAG Query
```bash
curl -X POST http://localhost:8000/regulations/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Can I store CVV values?",
    "top_k": 3
  }'
```

### Test Obligation Retrieval
```bash
curl "http://localhost:8000/regulations/obligations?severity=CRITICAL"
```

### View Auto-Docs
Open browser: http://localhost:8000/docs

---

## 🎯 Key Features

✅ **Auto-Ingestion:** Loads PCI-DSS, GDPR, CCPA, internal policies on startup  
✅ **Vector Search:** Semantic similarity with ChromaDB  
✅ **Obligation Extraction:** Rule-based with LLM-ready architecture  
✅ **Clean APIs:** RESTful with Pydantic validation  
✅ **Agent-Ready:** Designed for autonomous agent consumption  
✅ **Explainable:** Returns confidence scores and source references  
✅ **Demo-Ready:** Works out-of-the-box with mock data  

---

## 🚨 Important Notes

### For Hackathon MVP:
- ✅ Uses in-memory ChromaDB (resets on restart)
- ✅ Rule-based obligation extraction (no LLM API required)
- ✅ Mock regulatory data included
- ✅ No authentication (add for production)

### For Production:
- 🔧 Persist ChromaDB to disk/remote
- 🔧 Integrate LLM API for extraction
- 🔧 Add authentication & rate limiting
- 🔧 Implement caching layer
- 🔧 Add monitoring & logging
- 🔧 Parse real PDF/DOCX files

---

## 📝 LLM Integration (Future)

To enable LLM-based extraction:

1. **Add API key to `.env`:**
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

2. **Update `obligation_extractor.py`:**
```python
async def extract_with_llm(self, text, regulation, section):
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    prompt = self.EXTRACTION_PROMPT.format(
        text=text,
        regulation=regulation,
        section=section
    )
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )
    
    # Parse JSON response
    obligations = json.loads(response.content[0].text)
    return [Obligation(**ob) for ob in obligations]
```

3. **Call in ingestion:**
```python
obligations = await self.extractor.extract_with_llm(chunk_text, regulation, section)
```

---

## 🔌 Frontend Integration

### React Frontend Connection

Update React frontend to call backend:

```javascript
// src/services/regulatoryApi.js
const API_BASE = 'http://localhost:8000';

export async function queryRegulations(question) {
  const response = await fetch(`${API_BASE}/regulations/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: 5 })
  });
  return response.json();
}

export async function getObligations(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/regulations/obligations?${params}`);
  return response.json();
}
```

### Update Compliance Agent

Modify `src/services/complianceAgent.js`:

```javascript
import { queryRegulations } from './regulatoryApi';

async analyzeWithBackend(content, sourceType) {
  const question = `Does this content violate regulations: ${content}?`;
  const response = await queryRegulations(question);
  
  return {
    is_violation: response.obligations.length > 0,
    explanation: response.answer,
    obligations: response.obligations,
    confidence: response.confidence
  };
}
```

---

## 📊 Sample Queries

### Query 1: PAN in Logs
```json
{"question": "Is it okay to store credit card numbers in application logs?"}

Response:
"No. PCI-DSS 3.2.1 prohibits storage of PAN in logs."
Obligations: ["PCI_DSS_3_2_1_PROHIBIT_PAN"]
```

### Query 2: Data Retention
```json
{"question": "How long can we keep customer data?"}

Response:
"GDPR Article 5(1)(e) requires data to be kept only as long as necessary. Internal policy limits customer data to 24 months."
Obligations: ["GDPR_5_PROTECT_PII", "INTERNAL_GENERAL_PROTECT_PII"]
```

### Query 3: CVV Storage
```json
{"question": "Can we store CVV codes?"}

Response:
"No. PCI-DSS 3.3 prohibits storage of CVV after authorization under any circumstances."
Obligations: ["PCI_DSS_3_3_PROHIBIT_CVV"]
```

---

## 🏆 Success Criteria Met

✅ Ingests PCI-DSS, GDPR, CCPA, internal policies  
✅ Extracts structured obligations with metadata  
✅ Stores in vector database (ChromaDB)  
✅ Answers compliance questions via RAG  
✅ Exposes clean APIs for agent consumption  
✅ Returns confident, explainable answers  
✅ Demo-ready with mock data  
✅ Integration-ready for monitoring/remediation agents  

---

## 🎓 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                       │
│         Compliance Dashboard & Analysis UI               │
└────────────┬───────────────────────────────┬────────────┘
             │                               │
             │ HTTP/REST                     │
             ▼                               ▼
┌────────────────────────┐      ┌───────────────────────────┐
│   FastAPI Backend      │      │   Monitoring Agent        │
│   (This Module)        │◄─────┤   Remediation Agent       │
│                        │      │   Policy Mapping Agent    │
│  ┌─────────────────┐   │      └───────────────────────────┘
│  │  RAG Service    │   │
│  │  - ChromaDB     │   │
│  │  - Embeddings   │   │
│  └────────┬────────┘   │
│           │            │
│  ┌────────▼─────────┐  │
│  │ Ingestion        │  │
│  │ - Chunking       │  │
│  │ - Extraction     │  │
│  └────────┬─────────┘  │
│           │            │
│  ┌────────▼─────────┐  │
│  │ Obligation       │  │
│  │ Extractor        │  │
│  │ - Rules/LLM      │  │
│  └──────────────────┘  │
└────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │  Regulatory     │
    │  Documents      │
    │  - PCI-DSS      │
    │  - GDPR         │
    │  - CCPA         │
    │  - Internal     │
    └─────────────────┘
```

---

## 📞 Support

- **API Docs:** http://localhost:8000/docs
- **Source Code:** `/backend` directory
- **Sample Data:** `/backend/app/data/mock_regulations.py`

---

**Status:** ✅ Production-Ready for Demo  
**Next Steps:** Integrate with frontend, deploy, add LLM

🎉 **Happy Compliance Automation!**
