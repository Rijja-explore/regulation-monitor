"""
Violation storage - JSON file persistence
"""
import json
import os
import uuid
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime
from .models import ViolationRecord


class ViolationStore:
    """Manages violation persistence to JSON file"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.violations_file = self.data_dir / "violations.json"
        self._ensure_data_dir()
    
    def _ensure_data_dir(self):
        """Create data directory if it doesn't exist"""
        self.data_dir.mkdir(exist_ok=True)
        
        # Initialize violations.json if it doesn't exist
        if not self.violations_file.exists():
            initial_data = {
                "tenant_id": "visa",
                "violations": []
            }
            with open(self.violations_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
    
    def _read_violations(self) -> Dict[str, Any]:
        """Read violations from JSON file"""
        with open(self.violations_file, 'r') as f:
            return json.load(f)
    
    def _write_violations(self, data: Dict[str, Any]):
        """Write violations to JSON file"""
        with open(self.violations_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def generate_violation_id(self) -> str:
        """Generate unique violation ID"""
        unique_id = str(uuid.uuid4().hex[:6].upper())
        count = len(self.list_violations()) + 1
        return f"VIOL-{count:03d}-{unique_id}"
    
    def add_violation(
        self,
        evidence_id: str,
        source_type: str,
        source_id: str,
        severity: str,
        regulation: str,
        description: str,
        timestamp: datetime
    ) -> ViolationRecord:
        """
        Add a new violation to the store
        
        Args:
            evidence_id: Evidence ID from /evidence/capture
            source_type: Type of source (transaction, log, etc.)
            source_id: Source identifier
            severity: Severity level
            regulation: Regulation framework
            description: Violation description
            timestamp: Event timestamp
            
        Returns:
            ViolationRecord object
        """
        violation_id = self.generate_violation_id()
        
        violation = ViolationRecord(
            violation_id=violation_id,
            evidence_id=evidence_id,
            source_type=source_type,
            source_id=source_id,
            severity=severity,
            regulation=regulation,
            description=description,
            timestamp=timestamp
        )
        
        # Read current data
        data = self._read_violations()
        
        # Append new violation
        data["violations"].append(violation.model_dump(mode='json'))
        
        # Write back
        self._write_violations(data)
        
        return violation
    
    def list_violations(self) -> List[ViolationRecord]:
        """
        List all violations
        
        Returns:
            List of ViolationRecord objects
        """
        data = self._read_violations()
        violations = []
        
        for v in data["violations"]:
            violations.append(ViolationRecord(**v))
        
        return violations
    
    def get_tenant_id(self) -> str:
        """Get tenant ID"""
        data = self._read_violations()
        return data.get("tenant_id", "visa")
