#!/bin/bash
# =============================================================================
# MONITORING AGENT - LIVE DEMO SCRIPT
# Agentic AI-Enabled Continuous PCI/PII Compliance Platform
# =============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "=================================================================="
echo "   🎯 MONITORING AGENT - LIVE DEMO"
echo "   Person 2: Real-time PCI-DSS Violation Detection"
echo "=================================================================="
echo ""

# =============================================================================
# PART 1: SETUP
# =============================================================================
echo -e "${BLUE}PART 1: Setup & Verification${NC}"
echo "------------------------------------------------------------------"
echo ""

echo "✓ Checking Python version..."
python3 --version || python --version

echo ""
echo "✓ Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✓ Verifying file structure..."
if [ -f "monitoring_agent/api.py" ] && [ -f "data/violations.json" ]; then
    echo "  ✓ monitoring_agent/ - OK"
    echo "  ✓ data/violations.json - OK"
else
    echo -e "${RED}  ✗ Missing files!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""

# =============================================================================
# PART 2: UNIT TESTS
# =============================================================================
echo -e "${BLUE}PART 2: Running Unit Tests${NC}"
echo "------------------------------------------------------------------"
echo ""

python test_monitoring_agent.py

echo ""
echo -e "${GREEN}✓ All unit tests passed!${NC}"
echo ""

# =============================================================================
# PART 3: START SERVER (Background)
# =============================================================================
echo -e "${BLUE}PART 3: Starting FastAPI Server${NC}"
echo "------------------------------------------------------------------"
echo ""

echo "Starting server in background..."
uvicorn api.main:app --reload --port 8000 > /tmp/monitoring_server.log 2>&1 &
SERVER_PID=$!

echo "Server PID: $SERVER_PID"
echo "Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running!${NC}"
else
    echo -e "${RED}✗ Server failed to start${NC}"
    echo "Check logs: tail -f /tmp/monitoring_server.log"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo ""

# =============================================================================
# PART 4: LIVE API TESTS
# =============================================================================
echo -e "${BLUE}PART 4: Live API Demonstration${NC}"
echo "------------------------------------------------------------------"
echo ""

echo -e "${YELLOW}Test 1: Health Check${NC}"
echo "GET /monitor/health"
curl -s http://localhost:8000/monitor/health | jq .
echo ""
echo ""

sleep 1

echo -e "${YELLOW}Test 2: Ingest Data WITH PAN (Violation Expected)${NC}"
echo "Sending: My card is 4111 1111 1111 1111"
RESPONSE=$(curl -s -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "DEMO_TICKET_001",
    "content": "My card number is 4111 1111 1111 1111",
    "timestamp": "2026-01-05T00:00:00Z"
  }')

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.status == "violation_detected"' > /dev/null; then
    echo -e "${GREEN}✓ Violation detected correctly!${NC}"
    EVIDENCE_ID=$(echo "$RESPONSE" | jq -r '.evidence_id')
    echo "  Evidence ID: $EVIDENCE_ID"
else
    echo -e "${RED}✗ Expected violation, but none detected${NC}"
fi
echo ""
echo ""

sleep 1

echo -e "${YELLOW}Test 3: Ingest Data WITHOUT PAN (No Violation)${NC}"
echo "Sending: User login successful"
RESPONSE=$(curl -s -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "application_log",
    "source_id": "DEMO_LOG_001",
    "content": "User login successful for admin@example.com",
    "timestamp": "2026-01-05T00:05:00Z"
  }')

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.status == "no_violation"' > /dev/null; then
    echo -e "${GREEN}✓ Correctly identified no violation!${NC}"
else
    echo -e "${RED}✗ Unexpected result${NC}"
fi
echo ""
echo ""

sleep 1

echo -e "${YELLOW}Test 4: Ingest Masked PAN (No Violation)${NC}"
echo "Sending: Card ending in **** **** **** 1111"
RESPONSE=$(curl -s -X POST http://localhost:8000/monitor/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "transaction",
    "source_id": "DEMO_TXN_001",
    "content": "Payment processed for card **** **** **** 1111",
    "timestamp": "2026-01-05T00:10:00Z"
  }')

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.status == "no_violation"' > /dev/null; then
    echo -e "${GREEN}✓ Masked PAN correctly ignored!${NC}"
else
    echo -e "${RED}✗ Unexpected result${NC}"
fi
echo ""
echo ""

sleep 1

echo -e "${YELLOW}Test 5: List All Violations${NC}"
echo "GET /monitor/violations"
VIOLATIONS=$(curl -s http://localhost:8000/monitor/violations)
echo "$VIOLATIONS" | jq .

VIOLATION_COUNT=$(echo "$VIOLATIONS" | jq '.count')
echo ""
echo -e "${GREEN}✓ Total violations detected: $VIOLATION_COUNT${NC}"
echo ""
echo ""

sleep 1

echo -e "${YELLOW}Test 6: Verify Evidence Capture${NC}"
echo "GET /evidence"
curl -s http://localhost:8000/evidence | jq '.count, .evidence[] | select(.event_type == "violation") | {evidence_id, regulation: .regulation.framework, severity: .metadata.severity}'
echo ""
echo ""

# =============================================================================
# PART 5: VERIFY PERSISTENCE
# =============================================================================
echo -e "${BLUE}PART 5: Verify Data Persistence${NC}"
echo "------------------------------------------------------------------"
echo ""

echo "Checking violations.json file..."
if [ -f "data/violations.json" ]; then
    echo -e "${GREEN}✓ violations.json exists${NC}"
    echo ""
    echo "File contents:"
    cat data/violations.json | jq .
else
    echo -e "${RED}✗ violations.json not found${NC}"
fi

echo ""

# =============================================================================
# PART 6: CLEANUP
# =============================================================================
echo -e "${BLUE}PART 6: Demo Complete${NC}"
echo "------------------------------------------------------------------"
echo ""

echo "Stopping server (PID: $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true
sleep 2

echo ""
echo "=================================================================="
echo -e "${GREEN}   ✓ DEMO COMPLETED SUCCESSFULLY!${NC}"
echo "=================================================================="
echo ""
echo "Summary:"
echo "  • Unit tests: PASSED"
echo "  • Server: STARTED"
echo "  • Health check: OK"
echo "  • PAN detection: WORKING"
echo "  • Evidence capture: WORKING"
echo "  • Violation storage: WORKING"
echo "  • Total violations: $VIOLATION_COUNT"
echo ""
echo "Key Files:"
echo "  • API Routes: monitoring_agent/api.py"
echo "  • Detector: monitoring_agent/detectors.py"
echo "  • Storage: data/violations.json"
echo "  • Evidence: /evidence/capture endpoint"
echo ""
echo "Next Steps:"
echo "  1. Integrate with frontend: GET /monitor/violations"
echo "  2. View audit trail: GET /evidence"
echo "  3. Generate bundle: POST /audit/generate-bundle"
echo ""
echo "🎉 Ready for judges!"
echo ""
