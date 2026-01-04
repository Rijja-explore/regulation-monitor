#!/bin/bash
# Quick Test - Verifies everything works in one command

echo "🧪 QUICK VERIFICATION TEST"
echo "=========================="
echo ""

cd "$(dirname "$0")"

# Test 1: File structure
echo "✓ Checking file structure..."
if [ ! -f "monitoring_agent/api.py" ]; then
    echo "✗ Missing monitoring_agent/api.py"
    exit 1
fi
if [ ! -f "data/violations.json" ]; then
    echo "✗ Missing data/violations.json"
    exit 1
fi
echo "  Files: OK"
echo ""

# Test 2: Unit tests
echo "✓ Running unit tests..."
python test_monitoring_agent.py > /tmp/unit_test.log 2>&1
if [ $? -eq 0 ]; then
    echo "  Unit Tests: PASSED"
else
    echo "✗ Unit tests failed. Check /tmp/unit_test.log"
    exit 1
fi
echo ""

# Test 3: Server quick test
echo "✓ Testing API server..."
timeout 15 bash -c 'uvicorn api.main:app --port 8000 > /tmp/quick_server.log 2>&1 & SERVER_PID=$!; sleep 5; HEALTH=$(curl -s http://localhost:8000/monitor/health); kill $SERVER_PID 2>/dev/null; echo $HEALTH' > /tmp/health_response.json

if grep -q "healthy" /tmp/health_response.json; then
    echo "  Server: OK"
else
    echo "✗ Server test failed. Check /tmp/quick_server.log"
    exit 1
fi
echo ""

# Test 4: Check violations
echo "✓ Checking violations.json..."
VIOLATION_COUNT=$(cat data/violations.json | jq '.violations | length' 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "  Violations stored: $VIOLATION_COUNT"
else
    echo "✗ Could not read violations.json"
    exit 1
fi
echo ""

echo "=========================="
echo "✅ ALL CHECKS PASSED!"
echo "=========================="
echo ""
echo "Your monitoring agent is working correctly!"
echo ""
echo "Next steps:"
echo "  1. Start server: uvicorn api.main:app --reload"
echo "  2. Run full tests: ./test_api.sh"
echo "  3. Run demo: ./demo_monitoring_agent.sh"
echo ""
