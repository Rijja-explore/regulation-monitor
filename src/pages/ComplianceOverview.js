import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ComplianceOverview = () => {
  // Global compliance status
  const complianceStatus = 'AT RISK'; // COMPLIANT | AT RISK | NON-COMPLIANT
  
  // Regulatory heatmap data
  const regulatoryData = [
    { regulation: 'PCI-DSS', data: 'amber', policies: 'green', operations: 'red', overall: 'amber' },
    { regulation: 'GDPR', data: 'green', policies: 'green', operations: 'amber', overall: 'green' },
    { regulation: 'CCPA', data: 'green', policies: 'amber', operations: 'green', overall: 'green' },
    { regulation: 'SOX', data: 'amber', policies: 'green', operations: 'green', overall: 'amber' },
  ];

  // Active risks
  const activeRisks = [
    {
      id: 1,
      severity: 'red',
      title: 'PAN detected in support chat',
      description: 'Credit card number found in ticket #3847',
    },
    {
      id: 2,
      severity: 'amber',
      title: 'Policy outdated vs GDPR update',
      description: 'Data retention policy needs review',
    },
    {
      id: 3,
      severity: 'green',
      title: 'No active breach events',
      description: 'All systems operating normally',
    },
  ];

  // Agent activity feed
  const agentActivity = [
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
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Key Active Risks
        </h3>
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
