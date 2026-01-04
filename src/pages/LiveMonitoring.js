import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LiveMonitoring = () => {
  const [activeTab, setActiveTab] = useState('support-chats');

  const tabs = [
    { id: 'transaction-logs', label: 'Transaction Logs' },
    { id: 'support-chats', label: 'Support Chats' },
    { id: 'internal-docs', label: 'Internal Documents' },
  ];

  const chatData = {
    ticketId: '#3847',
    timestamp: '2026-01-04 14:32:18',
    customer: 'John Davis',
    agent: 'Sarah Chen',
    conversation: [
      { speaker: 'Customer', text: 'Hi, I need help with my recent transaction.' },
      { speaker: 'Agent', text: 'Of course! Can you provide your card details?' },
      { 
        speaker: 'Customer', 
        text: 'Sure, my card number is 4532-1234-5678-9010 and CVV is 123.',
        hasPAN: true,
      },
      { speaker: 'Agent', text: 'Thank you. Let me look that up for you.' },
    ],
  };

  const violationContext = {
    regulation: 'PCI-DSS 3.2.1 - Requirement 3',
    goal: 'Protect stored cardholder data',
    severity: 'CRITICAL',
    detected: '14:32:20',
    status: 'Remediation in progress',
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
        Live Monitoring
      </h2>

      {/* Data Source Selector */}
      <div className="flex gap-2 border-b border-border-color">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-accent-blue'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Live Data Viewer */}
        <div className="col-span-2 bg-bg-card rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                Support Chat - Ticket {chatData.ticketId}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {chatData.timestamp} • {chatData.customer} ↔ {chatData.agent}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-bg-primary rounded p-4 max-h-96 overflow-y-auto">
            {chatData.conversation.map((message, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs text-text-secondary font-medium">
                  {message.speaker}
                </div>
                <div className="text-text-primary">
                  {message.hasPAN ? (
                    <>
                      Sure, my card number is{' '}
                      <motion.span
                        initial={{ backgroundColor: 'rgba(229,72,77,1)' }}
                        animate={{ 
                          backgroundColor: 'rgba(229,72,77,0.5)',
                          x: [0, -3, 3, -2, 2, 0]
                        }}
                        transition={{ 
                          backgroundColor: { duration: 0.2 },
                          x: { duration: 0.3 }
                        }}
                        className="px-2 py-1 rounded text-white font-mono"
                      >
                        4532-1234-5678-9010
                      </motion.span>
                      {' '}and CVV is 123.
                    </>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-risk-red rounded-full animate-pulse"></div>
            <span className="text-risk-red font-medium">
              PAN detected by Monitoring Agent (PCI-DSS)
            </span>
          </div>
        </div>

        {/* Violation Context Card (Sticky) */}
        <motion.div
          animate={{ boxShadow: '0 0 15px rgba(244,196,48,0.4)' }}
          className="bg-bg-card rounded-lg p-6 h-fit sticky top-8"
        >
          <h3 className="text-lg font-semibold text-risk-red mb-4">
            Active Violation
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">
                Regulation Impacted
              </p>
              <p className="text-text-primary text-sm">
                {violationContext.regulation}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">
                Compliance Goal Violated
              </p>
              <p className="text-text-primary text-sm">
                {violationContext.goal}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">
                Severity
              </p>
              <span className="inline-block px-3 py-1 rounded bg-risk-red text-white text-sm font-medium">
                {violationContext.severity}
              </span>
            </div>

            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">
                Time Detected
              </p>
              <p className="text-text-primary text-sm font-mono">
                {violationContext.detected}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">
                Remediation Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-risk-amber rounded-full animate-pulse"></div>
                <p className="text-risk-amber text-sm font-medium">
                  {violationContext.status}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border-color">
            <button className="w-full bg-accent-blue hover:bg-opacity-90 text-white py-2 px-4 rounded transition-colors">
              View Remediation
            </button>
          </div>
        </motion.div>
      </div>

      {/* Additional monitoring stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">1,247</div>
          <div className="text-sm text-text-secondary">Transactions Scanned</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">89</div>
          <div className="text-sm text-text-secondary">Support Chats Monitored</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-risk-red">3</div>
          <div className="text-sm text-text-secondary">Active Violations</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-risk-amber">12</div>
          <div className="text-sm text-text-secondary">Warnings</div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMonitoring;
