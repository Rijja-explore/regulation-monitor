#!/usr/bin/env python3
"""
Test script for Monitoring Agent
Demonstrates PAN detection and violation capture
"""
import asyncio
import json
from datetime import datetime
from monitoring_agent.detectors import PANDetector
from monitoring_agent.models import (
    IngestRequest,
    ViolationObject,
    RegulationInfo,
    DetectionInfo,
    ViolationState,
    ViolationMetadata
)
from monitoring_agent.store import ViolationStore


def test_pan_detector():
    """Test PAN detection logic"""
    print("=" * 60)
    print("TEST 1: PAN Detection Engine")
    print("=" * 60)
    
    detector = PANDetector()
    
    test_cases = [
        ("My card is 4111 1111 1111 1111", True, "Valid PAN with spaces"),
        ("Card: 4111111111111111", True, "Valid PAN without spaces"),
        ("Number 4111-1111-1111-1111", True, "Valid PAN with dashes"),
        ("Masked: **** **** **** 1111", False, "Masked PAN (should be ignored)"),
        ("Invalid: 1234 5678 9012 3456", False, "Invalid Luhn checksum"),
        ("No PAN here", False, "No PAN present"),
    ]
    
    for content, should_detect, description in test_cases:
        detected = detector.detect(content)
        status = "✓ PASS" if (detected is not None) == should_detect else "✗ FAIL"
        print(f"{status} | {description}")
        print(f"       Content: {content}")
        print(f"       Detected: {detected if detected else 'None'}")
        print()


def test_violation_creation():
    """Test violation object creation"""
    print("=" * 60)
    print("TEST 2: Violation Object Creation")
    print("=" * 60)
    
    violation = ViolationObject(
        event_type="violation",
        regulation=RegulationInfo(),
        detection=DetectionInfo(
            detected_by="MonitoringAgent",
            source_type="support_chat",
            source_id="TICKET_TEST",
            matched_pattern="4111 1111 1111 1111"
        ),
        violation_state=ViolationState(
            before="My card is 4111 1111 1111 1111"
        ),
        metadata=ViolationMetadata(
            severity="Critical",
            tenant_id="visa"
        )
    )
    
    print(json.dumps(violation.model_dump(), indent=2))
    print("✓ Violation object created successfully")
    print()


def test_violation_store():
    """Test violation storage"""
    print("=" * 60)
    print("TEST 3: Violation Storage")
    print("=" * 60)
    
    # Use test data directory
    store = ViolationStore(data_dir="data")
    
    # Add test violation
    violation = store.add_violation(
        evidence_id="EVID-TEST-123456",
        source_type="support_chat",
        source_id="TICKET_TEST",
        severity="Critical",
        regulation="PCI-DSS",
        description="PAN exposed in plaintext",
        timestamp=datetime.utcnow()
    )
    
    print(f"✓ Violation stored: {violation.violation_id}")
    print(f"  Evidence ID: {violation.evidence_id}")
    print(f"  Source: {violation.source_type} / {violation.source_id}")
    print(f"  Severity: {violation.severity}")
    print()
    
    # List all violations
    violations = store.list_violations()
    print(f"✓ Total violations in store: {len(violations)}")
    print()


def test_integration():
    """Test end-to-end flow"""
    print("=" * 60)
    print("TEST 4: End-to-End Integration")
    print("=" * 60)
    
    # Sample ingestion request
    request_data = {
        "source_type": "support_chat",
        "source_id": "TICKET_999",
        "content": "Customer provided card: 4111 1111 1111 1111",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    print("Input Request:")
    print(json.dumps(request_data, indent=2))
    print()
    
    # Validate with Pydantic
    request = IngestRequest(**request_data)
    print("✓ Request validated")
    
    # Detect PAN
    detector = PANDetector()
    detected_pan = detector.detect(request.content)
    
    if detected_pan:
        print(f"✓ PAN detected: {detected_pan}")
        print("✓ Violation would be created")
        print("✓ Evidence would be captured via /evidence/capture")
        print("✓ Violation would be stored in violations.json")
    else:
        print("✗ No PAN detected")
    
    print()


def main():
    """Run all tests"""
    print("\n")
    print("🔍 MONITORING AGENT - TEST SUITE")
    print("Agentic AI-Enabled Continuous PCI/PII Compliance Platform")
    print("\n")
    
    try:
        test_pan_detector()
        test_violation_creation()
        test_violation_store()
        test_integration()
        
        print("=" * 60)
        print("✓ ALL TESTS COMPLETED")
        print("=" * 60)
        print()
        print("Next Steps:")
        print("1. Start the FastAPI server: uvicorn api.main:app --reload")
        print("2. Test via API: curl http://localhost:8000/monitor/health")
        print("3. Send test data: curl -X POST http://localhost:8000/monitor/ingest")
        print()
        
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
