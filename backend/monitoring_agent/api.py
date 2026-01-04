"""
FastAPI routes for Monitoring & Violation Detection Agent
Endpoints:
- GET /health
- POST /monitor/ingest
- GET /monitor/violations
"""
from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from .models import (
    IngestRequest,
    ViolationObject,
    ViolationMetadata,
    RegulationInfo,
    DetectionInfo,
    ViolationState,
    ViolationsResponse
)
from .detectors import PANDetector
from .evidence_client import EvidenceClient
from .store import ViolationStore


# Initialize components
router = APIRouter(prefix="/monitor", tags=["Monitoring Agent"])
pan_detector = PANDetector()
evidence_client = EvidenceClient()
violation_store = ViolationStore(data_dir="data")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Monitoring & Violation Detection Agent",
        "version": "1.0.0",
        "capabilities": ["PCI-DSS PAN Detection"]
    }


@router.post("/ingest")
async def ingest_data(request: IngestRequest):
    """
    Ingest data for real-time violation detection
    
    Detects PCI-DSS PAN exposure violations and creates evidence records
    """
    try:
        # Detect PAN in content
        detected_pan = pan_detector.detect(request.content)
        
        if not detected_pan:
            return {
                "status": "no_violation",
                "message": "No PAN exposure detected",
                "source_id": request.source_id
            }
        
        # PAN detected - create violation object
        violation = ViolationObject(
            event_type="violation",
            regulation=RegulationInfo(),
            detection=DetectionInfo(
                detected_by="MonitoringAgent",
                source_type=request.source_type,
                source_id=request.source_id,
                matched_pattern=detected_pan
            ),
            violation_state=ViolationState(
                before=request.content
            ),
            metadata=ViolationMetadata(
                severity="Critical",
                tenant_id="visa"
            )
        )
        
        # Capture evidence via API
        evidence_response = await evidence_client.capture_evidence(violation)
        evidence_id = evidence_response["evidence_id"]
        
        # Store violation in JSON file
        violation_record = violation_store.add_violation(
            evidence_id=evidence_id,
            source_type=request.source_type,
            source_id=request.source_id,
            severity="Critical",
            regulation="PCI-DSS",
            description="PAN exposed in plaintext",
            timestamp=request.timestamp
        )
        
        return {
            "status": "violation_detected",
            "violation_id": violation_record.violation_id,
            "evidence_id": evidence_id,
            "severity": "Critical",
            "message": "PAN exposure detected and evidence captured"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing data: {str(e)}"
        )


@router.get("/violations", response_model=ViolationsResponse)
async def list_violations():
    """
    List all detected violations
    
    Reads from violations.json file
    """
    try:
        violations = violation_store.list_violations()
        tenant_id = violation_store.get_tenant_id()
        
        return ViolationsResponse(
            count=len(violations),
            tenant_id=tenant_id,
            violations=violations
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving violations: {str(e)}"
        )
