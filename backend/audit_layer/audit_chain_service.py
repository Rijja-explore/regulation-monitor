import hashlib
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from models.evidence import EvidenceRecord
from models.audit_chain import AuditChainNode
import logging

logger = logging.getLogger(__name__)


class AuditChainService:
    """Service for managing immutable audit chain with SHA-256 cryptographic hashing"""
    
    def __init__(self):
        self.chain_store: List[AuditChainNode] = []  # In-memory store
        
        # File-based persistence for hash chain
        project_root = Path(__file__).parent.parent
        self.chain_storage_path = project_root / "data" / "audit_chain.json"
        logger.info(f"Hash-chain storage initialized at: {self.chain_storage_path.absolute()}")
        self._ensure_storage_exists()
        self._load_chain_from_file()
    
    def _ensure_storage_exists(self):
        """Create audit chain storage file if it doesn't exist"""
        self.chain_storage_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.chain_storage_path.exists():
            initial_chain = {
                "chain_id": "audit_chain_v1", 
                "created_at": datetime.utcnow().isoformat(),
                "chain": []
            }
            with open(self.chain_storage_path, 'w') as f:
                json.dump(initial_chain, f, indent=2)
            logger.info(f"Created new audit chain storage at: {self.chain_storage_path.absolute()}")
    
    def _load_chain_from_file(self):
        """Load existing audit chain from file"""
        try:
            with open(self.chain_storage_path, 'r') as f:
                data = json.load(f)
                for node_dict in data.get("chain", []):
                    # Convert timestamp string back to datetime
                    node_dict['timestamp'] = datetime.fromisoformat(node_dict['timestamp'].replace('Z', '+00:00'))
                    node = AuditChainNode(**node_dict)
                    self.chain_store.append(node)
            logger.info(f"Loaded {len(self.chain_store)} audit chain nodes from file")
        except Exception as e:
            logger.error(f"Error loading audit chain from file: {e}")
    
    def _save_chain_to_file(self):
        """Save audit chain to file"""
        try:
            chain_data = {
                "chain_id": "audit_chain_v1",
                "created_at": datetime.utcnow().isoformat(),
                "total_nodes": len(self.chain_store),
                "chain": [node.model_dump(mode='json') for node in self.chain_store]
            }
            with open(self.chain_storage_path, 'w') as f:
                json.dump(chain_data, f, indent=2, default=str)
            logger.info(f"Saved {len(self.chain_store)} audit chain nodes to file")
            return True
        except Exception as e:
            logger.error(f"Error saving audit chain to file: {e}")
            return False

    def compute_hash(self, data: str) -> str:
        """Compute SHA256 cryptographic hash"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    def create_node(
        self,
        evidence: EvidenceRecord,
        previous_hash: Optional[str],
        sequence_number: int
    ) -> AuditChainNode:
        """Create a new audit chain node"""
        # Serialize evidence
        evidence_json = json.dumps(evidence.model_dump(), sort_keys=True, default=str)
        data_hash = self.compute_hash(evidence_json)
        
        # Compute record hash (includes previous hash for chaining)
        hash_input = f"{previous_hash or ''}{data_hash}{evidence.timestamp.isoformat()}"
        record_hash = self.compute_hash(hash_input)
        
        return AuditChainNode(
            evidence_id=evidence.evidence_id,
            previous_hash=previous_hash,
            timestamp=evidence.timestamp,
            evidence_data=evidence.model_dump(),
            data_hash=data_hash,
            record_hash=record_hash,
            sequence_number=sequence_number
        )
    
    def append(self, evidence: EvidenceRecord) -> AuditChainNode:
        """Append evidence to cryptographic hash chain"""
        # Get last node's hash for chaining
        last_node = self.get_latest_node()
        previous_hash = last_node.record_hash if last_node else None
        sequence_number = len(self.chain_store)
        
        # Create new node with cryptographic hash chaining
        node = self.create_node(evidence, previous_hash, sequence_number)
        
        # Add to chain
        self.chain_store.append(node)
        
        # Persist to file for tamper-proof storage
        self._save_chain_to_file()
        
        logger.info(f"Added node {node.evidence_id} to hash chain (sequence: {sequence_number})")
        return node
    
    def get_latest_node(self) -> Optional[AuditChainNode]:
        """Get the most recent node in chain"""
        return self.chain_store[-1] if self.chain_store else None
    
    def get_chain_in_range(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> List[AuditChainNode]:
        """Get chain nodes in date range"""
        return [
            node for node in self.chain_store
            if start_date <= node.timestamp <= end_date
        ]
    
    def get_all_nodes(self) -> List[AuditChainNode]:
        """Get all nodes in chain"""
        return self.chain_store.copy()
    
    def verify_chain(self) -> Dict[str, Any]:
        """Verify hash chain integrity"""
        if len(self.chain_store) == 0:
            return {"valid": True, "message": "Empty chain", "errors": []}
        
        if len(self.chain_store) == 1:
            # Single node (genesis)
            return {"valid": True, "message": "Single node (genesis)", "errors": []}
        
        errors = []
        
        # Check genesis node
        genesis = self.chain_store[0]
        if genesis.previous_hash is not None:
            errors.append({
                "node": genesis.evidence_id,
                "issue": "Genesis node should have null previous_hash",
                "actual": genesis.previous_hash
            })
        
        # Check chain integrity
        for i in range(1, len(self.chain_store)):
            current_node = self.chain_store[i]
            previous_node = self.chain_store[i-1]
            
            if current_node.previous_hash != previous_node.record_hash:
                errors.append({
                    "node": current_node.evidence_id,
                    "sequence": current_node.sequence_number,
                    "expected_hash": previous_node.record_hash,
                    "actual_hash": current_node.previous_hash,
                    "issue": "Hash mismatch - chain broken"
                })
        
        # Verify each node's hash is correct
        for node in self.chain_store:
            evidence_json = json.dumps(node.evidence_data, sort_keys=True, default=str)
            expected_data_hash = self.compute_hash(evidence_json)
            
            if node.data_hash != expected_data_hash:
                errors.append({
                    "node": node.evidence_id,
                    "issue": "Data hash mismatch",
                    "expected": expected_data_hash,
                    "actual": node.data_hash
                })
            
            # Verify record hash
            hash_input = f"{node.previous_hash or ''}{node.data_hash}{node.timestamp.isoformat()}"
            expected_record_hash = self.compute_hash(hash_input)
            
            if node.record_hash != expected_record_hash:
                errors.append({
                    "node": node.evidence_id,
                    "issue": "Record hash mismatch",
                    "expected": expected_record_hash,
                    "actual": node.record_hash
                })
        
        return {
            "valid": len(errors) == 0,
            "total_nodes": len(self.chain_store),
            "errors": errors
        }
    
    def get_node_by_evidence_id(self, evidence_id: str) -> Optional[AuditChainNode]:
        """Get chain node by evidence ID"""
        for node in self.chain_store:
            if node.evidence_id == evidence_id:
                return node
        return None

