import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, AlertCircle, CheckCircle, Shield, Clock } from 'lucide-react';
import api from '../services/api';

const Evidence = () => {
  const [evidenceRecords, setEvidenceRecords] = useState([]);
  const [auditChain, setAuditChain] = useState([]);
  const [chainVerification, setChainVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidenceAndChain();
  }, []);

  const loadEvidenceAndChain = async () => {
    try {
      // Load evidence records
      const records = await api.getEvidence();
      setEvidenceRecords(records || []);

      // Load audit chain
      const chainResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/audit/trail`);
      if (chainResponse.ok) {
        const chainData = await chainResponse.json();
        setAuditChain(chainData.chain || []);
      }

      // Verify chain integrity
      const verifyResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/audit/verify`);
      if (verifyResponse.ok) {
        const verification = await verifyResponse.json();
        setChainVerification(verification);
      }
    } catch (error) {
      console.error('Failed to load evidence and chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAuditChain = () => {
    const chainData = {
      verification: chainVerification,
      chain: auditChain,
      export_timestamp: new Date().toISOString(),
      total_nodes: auditChain.length
    };
    
    const blob = new Blob([JSON.stringify(chainData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-chain-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadEvidenceRecords = () => {
    const evidenceData = {
      evidence_records: evidenceRecords,
      export_timestamp: new Date().toISOString(),
      total_records: evidenceRecords.length
    };
    
    const blob = new Blob([JSON.stringify(evidenceData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evidence-records-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-8 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-text-primary">
          Cryptographic Evidence & Audit Trail
        </h2>
        <div className="flex gap-3">
          <button
            onClick={downloadAuditChain}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            Download Hash Chain
          </button>
          <button
            onClick={downloadEvidenceRecords}
            className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg transition-colors"
          >
            <FileText size={16} />
            Download Evidence
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hash Chain Verification Status */}
          <div className="bg-bg-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-accent-blue" size={24} />
              <h3 className="text-xl font-semibold text-text-primary">
                Cryptographic Hash Chain Verification
              </h3>
            </div>
            
            {chainVerification && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {chainVerification.valid ? (
                    <CheckCircle className="text-risk-green" size={20} />
                  ) : (
                    <AlertCircle className="text-risk-red" size={20} />
                  )}
                  <span className={`font-semibold ${chainVerification.valid ? 'text-risk-green' : 'text-risk-red'}`}>
                    {chainVerification.valid ? '✅ Chain Verified - Tamper-proof' : '❌ Chain Compromised'}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Total Nodes:</span>
                    <div className="font-semibold text-text-primary">{chainVerification.total_nodes || 0}</div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Integrity Errors:</span>
                    <div className={`font-semibold ${chainVerification.errors?.length ? 'text-risk-red' : 'text-risk-green'}`}>
                      {chainVerification.errors?.length || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Verification Status:</span>
                    <div className={`font-semibold ${chainVerification.valid ? 'text-risk-green' : 'text-risk-red'}`}>
                      {chainVerification.valid ? 'VERIFIED' : 'FAILED'}
                    </div>
                  </div>
                </div>

                {chainVerification.errors?.length > 0 && (
                  <div className="mt-4 p-3 bg-risk-red/10 border border-risk-red/20 rounded-lg">
                    <h4 className="font-semibold text-risk-red mb-2">Hash Chain Integrity Errors:</h4>
                    <ul className="space-y-1 text-sm text-risk-red">
                      {chainVerification.errors.map((error, idx) => (
                        <li key={idx}>• {error.issue} (Node: {error.node})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!chainVerification && (
              <div className="text-text-secondary">
                Loading hash chain verification...
              </div>
            )}
          </div>

          {/* Hash Chain Nodes */}
          <div className="bg-bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-text-primary">
              Audit Chain Nodes ({auditChain.length})
            </h3>

            {auditChain.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <Shield size={48} className="mx-auto mb-4 opacity-50" />
                <p>No audit chain nodes found. Evidence will be linked as violations are detected.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditChain.slice(0, 10).map((node, index) => (
                  <motion.div
                    key={node.evidence_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-border-color rounded-lg p-4 hover:border-accent-blue/30 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <span className="text-text-secondary text-sm">Evidence ID:</span>
                        <div className="font-mono text-sm text-text-primary break-all">{node.evidence_id}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary text-sm">Sequence:</span>
                        <div className="font-semibold text-text-primary">{node.sequence_number}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary text-sm">Timestamp:</span>
                        <div className="text-sm text-text-primary">
                          {new Date(node.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary text-sm">Event Type:</span>
                        <div className="text-sm text-text-primary capitalize">
                          {node.evidence_data?.event_type?.replace('_', ' ') || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div>
                        <span className="text-text-secondary text-xs">Data Hash (SHA-256):</span>
                        <div className="font-mono text-xs text-text-primary break-all bg-bg-primary p-2 rounded border">
                          {node.data_hash}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-text-secondary text-xs">Record Hash (SHA-256):</span>
                        <div className="font-mono text-xs text-text-primary break-all bg-bg-primary p-2 rounded border">
                          {node.record_hash}
                        </div>
                      </div>
                      
                      {node.previous_hash && (
                        <div>
                          <span className="text-text-secondary text-xs">Previous Hash (Chain Link):</span>
                          <div className="font-mono text-xs text-text-primary break-all bg-bg-primary p-2 rounded border">
                            {node.previous_hash}
                          </div>
                        </div>
                      )}
                    </div>

                    {node.evidence_data && (
                      <div className="mt-3 pt-3 border-t border-border-color">
                        <span className="text-text-secondary text-xs">Evidence Data:</span>
                        <div className="text-xs text-text-primary">
                          Regulation: {node.evidence_data.regulation?.name || 'N/A'} | 
                          Detection: {node.evidence_data.detection?.matched_pattern ? ' Pattern Detected' : ' N/A'}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {auditChain.length > 10 && (
                  <div className="text-center py-4 text-text-secondary">
                    ... and {auditChain.length - 10} more nodes in the chain
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Evidence Records */}
          <div className="bg-bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-text-primary">
              Evidence Records ({evidenceRecords.length})
            </h3>

            {evidenceRecords.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No evidence records found. Evidence will be captured as compliance events occur.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {evidenceRecords.slice(0, 5).map((record, index) => (
                  <motion.div
                    key={record.evidence_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-border-color rounded-lg p-4 hover:border-accent-blue/30 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-text-secondary text-sm">Evidence ID:</span>
                        <div className="font-mono text-sm text-text-primary">{record.evidence_id}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary text-sm">Event Type:</span>
                        <div className="text-sm text-text-primary capitalize">{record.event_type?.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary text-sm">Timestamp:</span>
                        <div className="text-sm text-text-primary">{new Date(record.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {record.regulation && (
                      <div className="mt-3">
                        <span className="text-text-secondary text-sm">Regulation:</span>
                        <div className="text-sm text-text-primary">{record.regulation.name || 'Unknown'}</div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {evidenceRecords.length > 5 && (
                  <div className="text-center py-4 text-text-secondary">
                    ... and {evidenceRecords.length - 5} more evidence records
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Evidence;