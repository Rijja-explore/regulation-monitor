import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Brain, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ComplianceOverview = () => {
  const navigate = useNavigate();
  const [liveViolations, setLiveViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  
  // Fetch violations from backend
  useEffect(() => {
    async function loadViolations() {
      try {
        // Check backend health
        const health = await api.checkHealth();
        setBackendConnected(health.status === 'healthy');
        
        // Fetch existing violations from backend
        const violations = await api.getViolations();
        setLiveViolations(violations || []);
        
        // If no violations exist, create some demo data
        if (!violations || violations.length === 0) {
          try {
            await api.detectViolation('Customer card number is 4111 1111 1111 1111', 'support_chat', 'demo_001');
            await api.detectViolation('Payment failed for card 4532015112830366', 'application_log', 'demo_002');
            
            // Refetch violations
            const newViolations = await api.getViolations();
            setLiveViolations(newViolations || []);
          } catch (demoError) {
            console.warn('Demo violation creation failed:', demoError);
          }
        }
      } catch (error) {
        console.error('Failed to connect to backend:', error);
        setBackendConnected(false);
      } finally {
        setLoading(false);
      }
    }
    
    loadViolations();
    
    // Poll for new violations every 5 seconds
    const interval = setInterval(async () => {
      try {
        const violations = await api.getViolations();
        setLiveViolations(violations || []);
      } catch (error) {
        console.error('Failed to fetch violations:', error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Global compliance status
  const complianceStatus = liveViolations.filter(v => v.severity === 'CRITICAL').length > 0 
    ? 'NON-COMPLIANT' 
    : liveViolations.length > 0 
      ? 'AT RISK' 
      : 'COMPLIANT';
  
  // Regulatory heatmap data
  const regulatoryData = [
    { regulation: 'PCI-DSS', data: 'amber', policies: 'green', operations: 'red', overall: 'amber' },
    { regulation: 'GDPR', data: 'green', policies: 'green', operations: 'amber', overall: 'green' },
    { regulation: 'CCPA', data: 'green', policies: 'amber', operations: 'green', overall: 'green' },
    { regulation: 'SOX', data: 'amber', policies: 'green', operations: 'green', overall: 'amber' },
  ];

  // Active risks - now using live violations from backend
  const activeRisks = liveViolations.length > 0 
    ? liveViolations.map((v, idx) => ({
        id: idx + 1,
        severity: v.severity === 'CRITICAL' ? 'red' : v.severity === 'HIGH' ? 'amber' : 'green',
        title: v.context?.substring(0, 60) + '...' || 'Compliance violation detected',
        description: v.regulation || 'PCI-DSS',
        violationId: v.violation_id
      }))
    : [
        {
          id: 1,
          severity: 'green',
          title: backendConnected ? 'No active violations detected' : 'Backend disconnected',
          description: backendConnected ? 'All systems operating normally' : 'Unable to connect to backend API',
        },
      ];

  // Agent activity feed - enhanced with compliance agent
  const agentActivity = [
    { time: new Date().toLocaleTimeString().substring(0, 5), agent: 'Cognitive Compliance Agent', action: `detected ${liveViolations.length} violations` },
    { time: '10:15', agent: 'Remediation Agent', action: 'proposed fix for PAN exposure' },
    { time: '10:14', agent: 'Monitoring Agent', action: 'flagged violation in support ticket' },
    { time: '10:13', agent: 'Policy Agent', action: 'found missing control in data handling' },
    { time: '10:12', agent: 'Regulation Agent', action: 'detected PCI-DSS clause update' },
    { time: '10:10', agent: 'Monitoring Agent', action: 'scanned 1,247 transactions' },
  ];

  const getStatusColor = () => {
    if (complianceStatus === 'COMPLIANT') return 'risk-green';
    if (complianceStatus === 'AT RISK') return 'risk-amber';
    return 'risk-red';
  };

  const getStatusIcon = () => {
    if (complianceStatus === 'COMPLIANT') return <CheckCircle size={48} />;
    if (complianceStatus === 'AT RISK') return <AlertTriangle size={48} />;
    return <XCircle size={48} />;
  };

  const getDotColor = (status) => {
    if (status === 'green') return 'bg-risk-green';
    if (status === 'amber') return 'bg-risk-amber';
    return 'bg-risk-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-8 space-y-8"
    >
      {/* Backend Connection Status */}
      {!backendConnected && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-risk-red/10 border border-risk-red rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <XCircle className="text-risk-red" size={24} />
            <div>
              <h4 className="font-semibold text-risk-red">Backend API Disconnected</h4>
              <p className="text-sm text-text-secondary">
                Unable to connect to http://localhost:8000. Make sure the backend is running.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Global Compliance Status */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: complianceStatus === 'NON-COMPLIANT' 
            ? '0 0 20px rgba(229,72,77,0.4)' 
            : '0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.4 }}
        className={`bg-bg-card rounded-lg p-8 border-2 border-${getStatusColor()}`}
      >
        <div className="flex items-center gap-6">
          <div className={`text-${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h2 className={`text-4xl font-bold text-${getStatusColor()} mb-2`}>
              {complianceStatus}
            </h2>
            <p className="text-text-secondary text-lg">
              Continuous PCI & PII compliance evaluated autonomously
            </p>
          </div>
        </div>
      </motion.div>

      {/* Regulatory Risk Heatmap */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Regulatory Risk Heatmap
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Regulation</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Data</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Policies</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Operations</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Overall</th>
              </tr>
            </thead>
            <tbody>
              {regulatoryData.map((row, index) => (
                <tr key={index} className="border-b border-border-color hover:bg-border-color transition-colors">
                  <td className="py-4 px-4 text-text-primary font-medium">{row.regulation}</td>
                  <td className="py-4 px-4">
                    <div className={`w-3 h-3 rounded-full ${getDotColor(row.data)}`}></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`w-3 h-3 rounded-full ${getDotColor(row.policies)}`}></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`w-3 h-3 rounded-full ${getDotColor(row.operations)}`}></div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`w-3 h-3 rounded-full ${getDotColor(row.overall)}`}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Active Risks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">
            Key Active Risks
          </h3>
          <button
            onClick={() => navigate('/violation-analysis')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-visa-blue to-visa-orange text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Brain size={18} />
            AI Analysis Tool
          </button>
        </div>
        <div className="grid gap-4">
          {activeRisks.map((risk, index) => (
            <motion.div
              key={risk.id}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`bg-bg-card rounded-lg p-6 border-l-4 border-${
                risk.severity === 'red' ? 'risk-red' :
                risk.severity === 'amber' ? 'risk-amber' :
                'risk-green'
              } cursor-pointer hover:bg-border-color transition-colors`}
              onClick={() => risk.violationId && navigate('/violation-analysis')}
            >
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 ${getDotColor(risk.severity)}`}></div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-text-primary mb-1">
                    {risk.title}
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {risk.description}
                  </p>
                  {risk.violationId && (
                    <p className="text-xs text-visa-blue font-mono mt-2">
                      {risk.violationId}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Autonomous Agent Feed */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Autonomous Agent Activity
        </h3>
        <div className="space-y-3">
          {agentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="flex gap-4 items-start p-3 rounded hover:bg-border-color transition-colors"
            >
              <div className="text-text-secondary text-sm font-mono min-w-[45px]">
                {activity.time}
              </div>
              <div className="w-2 h-2 bg-accent-blue rounded-full mt-1.5"></div>
              <div className="flex-1">
                <span className="text-accent-blue font-medium">{activity.agent}</span>
                <span className="text-text-secondary"> {activity.action}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceOverview;
