import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const GoalGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  // Graph nodes
  const nodes = [
    { 
      id: 1, 
      type: 'regulatory', 
      label: 'PCI-DSS 3.2.1', 
      x: 20, 
      y: 20,
      description: 'Protect cardholder data',
      clause: 'Requirement 3: Protect stored cardholder data',
      status: 'at-risk',
    },
    { 
      id: 2, 
      type: 'control', 
      label: 'Data Encryption', 
      x: 50, 
      y: 15,
      description: 'Encrypt all cardholder data at rest',
      linkedPolicies: ['Data Security Policy v2.1'],
      status: 'satisfied',
    },
    { 
      id: 3, 
      type: 'violation', 
      label: 'PAN in Plaintext', 
      x: 50, 
      y: 50,
      description: 'Primary Account Number detected in unencrypted support chat',
      regulation: 'PCI-DSS 3.2.1',
      status: 'violated',
    },
    { 
      id: 4, 
      type: 'control', 
      label: 'Access Control', 
      x: 80, 
      y: 20,
      description: 'Restrict access to cardholder data',
      linkedPolicies: ['Access Control Policy v1.4'],
      status: 'satisfied',
    },
    { 
      id: 5, 
      type: 'regulatory', 
      label: 'GDPR Art. 32', 
      x: 20, 
      y: 70,
      description: 'Security of processing',
      clause: 'Article 32: Implement appropriate technical measures',
      status: 'satisfied',
    },
    { 
      id: 6, 
      type: 'control', 
      label: 'Data Retention', 
      x: 50, 
      y: 80,
      description: 'Automated data deletion after 90 days',
      linkedPolicies: ['Data Retention Policy v3.0'],
      status: 'satisfied',
    },
  ];

  // Goal status summary
  const goalsSatisfied = nodes.filter(n => n.status === 'satisfied').length;
  const goalsAtRisk = nodes.filter(n => n.status === 'at-risk').length;
  const goalsViolated = nodes.filter(n => n.status === 'violated').length;

  const getNodeColor = (type, status) => {
    if (status === 'violated') return 'bg-risk-red';
    if (status === 'at-risk') return 'bg-risk-amber';
    if (type === 'regulatory') return 'bg-accent-blue';
    if (type === 'control') return 'bg-risk-green';
    return 'bg-text-secondary';
  };

  const getNodeBorderColor = (type, status) => {
    if (status === 'violated') return 'border-risk-red';
    if (status === 'at-risk') return 'border-risk-amber';
    if (type === 'regulatory') return 'border-accent-blue';
    if (type === 'control') return 'border-risk-green';
    return 'border-text-secondary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-8 h-screen overflow-hidden"
    >
      <h2 className="text-2xl font-semibold mb-6 text-text-primary">
        Compliance Goal Graph
      </h2>

      <div className="flex gap-6 h-[calc(100%-4rem)]">
        {/* Graph Canvas */}
        <div className="flex-1 bg-bg-card rounded-lg p-6 relative overflow-hidden">
          <div className="relative w-full h-full">
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="20%" y1="20%" x2="50%" y2="15%" stroke="var(--border-color)" strokeWidth="2" />
              <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="var(--risk-red)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="50%" y1="15%" x2="80%" y2="20%" stroke="var(--border-color)" strokeWidth="2" />
              <line x1="20%" y1="70%" x2="50%" y2="80%" stroke="var(--border-color)" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: node.status === 'violated' 
                    ? [
                        '0 0 0px rgba(229,72,77,0)',
                        '0 0 18px rgba(229,72,77,0.6)',
                        '0 0 0px rgba(229,72,77,0)'
                      ]
                    : '0 0 0px rgba(0,0,0,0)'
                }}
                transition={{ 
                  scale: { duration: 0.3, delay: node.id * 0.1 },
                  boxShadow: node.status === 'violated' 
                    ? { repeat: Infinity, duration: 2 }
                    : { duration: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedNode(node)}
                className={`absolute cursor-pointer ${getNodeColor(node.type, node.status)} 
                  border-2 ${getNodeBorderColor(node.type, node.status)} 
                  rounded-lg px-4 py-3 shadow-lg`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="text-sm font-semibold text-white whitespace-nowrap">
                  {node.label}
                </div>
                <div className="text-xs text-white opacity-80 mt-1">
                  {node.type === 'regulatory' ? '📋 Regulation' : 
                   node.type === 'control' ? '🔒 Control' : 
                   '🔴 Violation'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Node Details Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-96 bg-bg-card rounded-lg p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-text-primary">
                  {selectedNode.label}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-secondary uppercase mb-1">Description</p>
                  <p className="text-text-primary">{selectedNode.description}</p>
                </div>

                {selectedNode.clause && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase mb-1">Source Regulation</p>
                    <p className="text-text-primary">{selectedNode.clause}</p>
                  </div>
                )}

                {selectedNode.linkedPolicies && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase mb-1">Linked Policies</p>
                    <ul className="space-y-1">
                      {selectedNode.linkedPolicies.map((policy, idx) => (
                        <li key={idx} className="text-accent-blue text-sm">• {policy}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNode.regulation && (
                  <div>
                    <p className="text-xs text-text-secondary uppercase mb-1">Regulation Impacted</p>
                    <p className="text-text-primary">{selectedNode.regulation}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-text-secondary uppercase mb-1">Current Status</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    selectedNode.status === 'satisfied' ? 'bg-risk-green text-white' :
                    selectedNode.status === 'at-risk' ? 'bg-risk-amber text-white' :
                    'bg-risk-red text-white'
                  }`}>
                    {selectedNode.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-text-secondary uppercase mb-1">Last Updated</p>
                  <p className="text-text-primary text-sm">
                    {selectedNode.status === 'violated' ? 'Monitoring Agent' : 
                     selectedNode.type === 'regulatory' ? 'Regulation Agent' :
                     'Policy Agent'} - 2 hours ago
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Goal Status Summary */}
      <div className="fixed bottom-8 left-80 right-8 flex gap-4">
        <div className="bg-bg-card rounded-lg px-6 py-4 border-l-4 border-risk-green">
          <div className="text-2xl font-bold text-text-primary">{goalsSatisfied}</div>
          <div className="text-sm text-text-secondary">Goals Satisfied</div>
        </div>
        <div className="bg-bg-card rounded-lg px-6 py-4 border-l-4 border-risk-amber">
          <div className="text-2xl font-bold text-text-primary">{goalsAtRisk}</div>
          <div className="text-sm text-text-secondary">Goals At Risk</div>
        </div>
        <div className="bg-bg-card rounded-lg px-6 py-4 border-l-4 border-risk-red">
          <div className="text-2xl font-bold text-text-primary">{goalsViolated}</div>
          <div className="text-sm text-text-secondary">Goals Violated</div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalGraph;
