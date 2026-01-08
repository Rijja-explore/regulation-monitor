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
      <h2 className="text-2xl font-semibold text-text-primary">
        Evidence & Audit Trail
      </h2>

      {/* Incident Timeline */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-text-primary">
          Incident Timeline - Ticket #3847
        </h3>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border-color"></div>

          <div className="space-y-6">
            {incidentTimeline.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-4 top-2 w-5 h-5 rounded-full ${getPhaseColor(
                    event.phase
                  )} border-4 border-bg-card`}
                ></div>

                <div className="bg-bg-primary rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${getPhaseColor(
                          event.phase
                        )}`}
                      >
                        {event.phase}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary font-mono">
                      {event.timestamp}
                    </span>
                  </div>

                  <p className="text-text-primary font-medium mb-1">
                    {event.description}
                  </p>
                  <p className="text-sm text-text-secondary mb-2">
                    Agent: {event.agent}
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <FileText size={14} className="text-accent-blue" />
                    <span className="text-accent-blue">{event.evidence}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Artifacts */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Evidence Artifacts
        </h3>

        <div className="grid gap-4">
          {evidenceArtifacts.map((artifact) => (
            <motion.div
              key={artifact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: 'rgba(31,42,68,0.5)' }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-4 bg-bg-primary rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-border-color rounded flex items-center justify-center">
                  <FileText size={24} className="text-accent-blue" />
                </div>
                <div>
                  <h4 className="text-text-primary font-semibold">
                    {artifact.name}
                  </h4>
                  <p className="text-sm text-text-secondary mt-1">
                    {artifact.description}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                    <span>{artifact.type}</span>
                    <span>•</span>
                    <span>{artifact.size}</span>
                    <span>•</span>
                    <span>{artifact.generated}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-accent-blue hover:bg-opacity-90 text-white rounded transition-colors flex items-center gap-2">
                  <Download size={16} />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-border-color hover:bg-text-secondary text-text-primary rounded transition-colors">
                  View JSON
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audit Summary */}
      <div className="bg-bg-card rounded-lg p-6 border-l-4 border-accent-blue">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-accent-blue mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Audit-Ready Documentation
            </h3>
            <p className="text-text-secondary">
              All evidence has been timestamped, cryptographically signed, and stored
              in compliance with audit requirements. Chain of custody preserved for all
              artifacts. Ready for regulatory review.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-text-primary">4</div>
                <div className="text-sm text-text-secondary">Total Artifacts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">791 KB</div>
                <div className="text-sm text-text-secondary">Total Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-risk-green">100%</div>
                <div className="text-sm text-text-secondary">Compliance Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Evidence;
