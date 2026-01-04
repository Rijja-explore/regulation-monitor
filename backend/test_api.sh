#!/bin/bash
# API Testing Script for Monitoring Agent
# Make sure the server is running: uvicorn api.main:app --reload

BASE_URL="http://localhost:8000"

echo "========================================"
echo "MONITORING AGENT - API TEST SCRIPT"
echo "========================================"
echo ""

# Test 1: Health Check
echo "TEST 1: Health Check"
echo "GET /monitor/health"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/monitor/health" | jq .
echo ""
echo ""

# Test 2: Ingest data WITH PAN (should detect violation)
echo "TEST 2: Ingest Data with PAN (Violation Expected)"
echo "POST /monitor/ingest"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/monitor/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "support_chat",
    "source_id": "TICKET_142",
    "content": "My card number is 4111 1111 1111 1111",
    "timestamp": "2026-01-04T18:45:00Z"
  }' | jq .
echo ""
echo ""

# Test 3: Ingest data WITHOUT PAN (no violation)
echo "TEST 3: Ingest Data without PAN (No Violation)"
echo "POST /monitor/ingest"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/monitor/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "application_log",
    "source_id": "LOG_5678",
    "content": "User login successful for user@example.com",
    "timestamp": "2026-01-04T19:00:00Z"
  }' | jq .
echo ""
echo ""

# Test 4: Ingest masked PAN (should NOT detect)
echo "TEST 4: Ingest Masked PAN (No Violation)"
echo "POST /monitor/ingest"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/monitor/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "transaction",
    "source_id": "TXN_9999",
    "content": "Card ending in **** **** **** 1111 was charged",
    "timestamp": "2026-01-04T19:15:00Z"
  }' | jq .
echo ""
echo ""

# Test 5: Another violation with different source
echo "TEST 5: Transaction with PAN (Violation Expected)"
echo "POST /monitor/ingest"
echo "----------------------------------------"
curl -s -X POST "$BASE_URL/monitor/ingest" \
  -H "Content-Type: application/json" \
  -d '{
    "source_type": "transaction",
    "source_id": "TXN_12345",
    "content": "Processing payment for card 5555555555554444",
    "timestamp": "2026-01-04T19:30:00Z"
  }' | jq .
echo ""
echo ""

# Test 6: List all violations
echo "TEST 6: List All Violations"
echo "GET /monitor/violations"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/monitor/violations" | jq .
echo ""
echo ""

# Test 7: Check main health endpoint
echo "TEST 7: Main API Health Check"
echo "GET /health"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/health" | jq .
echo ""
echo ""

# Test 8: List evidence records (should include violations)
echo "TEST 8: List Evidence Records"
echo "GET /evidence"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/evidence" | jq '.count, .evidence[] | {evidence_id, event_type, regulation: .regulation.framework}'
echo ""
echo ""

echo "========================================"
echo "ALL TESTS COMPLETED"
echo "========================================"
echo ""
echo "Check data/violations.json for persisted violations"
echo ""
