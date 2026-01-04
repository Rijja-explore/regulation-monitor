import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, MoreHorizontal } from 'lucide-react';

const AgentActivity = () => {
  const agents = [
    {
      id: 1,
      name: 'Regulation Agent',
      status: 'active',
      description: 'Monitors regulatory updates and maps requirements to internal controls',
      lastAction: 'Detected PCI-DSS clause update',
      lastActionTime: '2 hours ago',
      tasksToday: 47,
    },
    {
      id: 2,
      name: 'Policy Agent',
      status: 'waiting',
      description: 'Maintains and updates compliance policies based on regulatory changes',
      lastAction: 'Found missing control in data handling',
      lastActionTime: '3 hours ago',
      tasksToday: 23,
    },
    {
      id: 3,
      name: 'Monitoring Agent',
      status: 'active',
      description: 'Continuously scans data sources for compliance violations',
      lastAction: 'Flagged violation in support ticket',
      lastActionTime: '1 hour ago',
      tasksToday: 1247,
    },
    {
      id: 4,
      name: 'Remediation Agent',
      status: 'active',
      description: 'Proposes and executes compliance remediation actions',
      lastAction: 'Proposed fix for PAN exposure',
      lastActionTime: '30 minutes ago',
      tasksToday: 12,
    },
  ];

  const recentDecisions = [
    {
      agent: 'Monitoring Agent',
      decision:
        'Detected PCI clause update → mapped to missing control → escalated risk to Remediation Agent',
      timestamp: '14:32',
      impact: 'Critical',
    },
    {
      agent: 'Remediation Agent',
      decision:
        'Analyzed PAN exposure → proposed masking solution → initiated automated remediation',
      timestamp: '14:35',
      impact: 'High',
    },
    {
      agent: 'Policy Agent',
      decision:
        'Reviewed data retention requirements → identified policy gap → generated update recommendation',
      timestamp: '13:15',
      impact: 'Medium',
    },
    {
      agent: 'Regulation Agent',
      decision:
        'Scanned GDPR amendments → no changes affecting current compliance state → continued monitoring',
      timestamp: '12:00',
      impact: 'Low',
    },
  ];

  const getStatusIndicator = (status) => {
    if (status === 'active') {
      return (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-3 h-3 bg-risk-green rounded-full"
        ></motion.div>
      );
    }
    if (status === 'waiting') {
      return (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-risk-amber rounded-full"
            ></motion.div>
          ))}
        </div>
      );
    }
    return <div className="w-3 h-3 bg-text-secondary rounded-full"></div>;
  };

  const getStatusText = (status) => {
    if (status === 'active') return 'Active';
    if (status === 'waiting') return 'Waiting';
    return 'Idle';
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-risk-green';
    if (status === 'waiting') return 'text-risk-amber';
    return 'text-text-secondary';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical':
        return 'bg-risk-red';
      case 'High':
        return 'bg-risk-amber';
      case 'Medium':
        return 'bg-accent-blue';
      case 'Low':
        return 'bg-text-secondary';
      default:
        return 'bg-text-secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-text-primary">Agent Activity</h2>

      {/* Agent List */}
      <div className="grid grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-card rounded-lg p-6 border border-border-color hover:border-accent-blue transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Activity size={24} className="text-accent-blue" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIndicator(agent.status)}
                    <span className={`text-sm font-medium ${getStatusColor(agent.status)}`}>
                      {getStatusText(agent.status)}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-text-secondary hover:text-text-primary transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <p className="text-text-secondary text-sm mb-4">{agent.description}</p>

            <div className="space-y-3 border-t border-border-color pt-4">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-text-secondary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{agent.lastAction}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {agent.lastActionTime}
                  </p>
                </div>
              </div>

              <div className="bg-bg-primary rounded px-3 py-2">
                <p className="text-xs text-text-secondary">Tasks Completed Today</p>
                <p className="text-2xl font-bold text-text-primary">{agent.tasksToday}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Decisions */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Recent Agent Decisions
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Human-readable reasoning traces from autonomous agents
        </p>

        <div className="space-y-4">
          {recentDecisions.map((decision, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-primary rounded-lg p-4 border-l-4 border-accent-blue"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent-blue">
                    {decision.agent}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getImpactColor(
                      decision.impact
                    )}`}
                  >
                    {decision.impact}
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-mono">
                  {decision.timestamp}
                </span>
              </div>
              <p className="text-text-primary text-sm leading-relaxed">
                {decision.decision}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent System Health */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-risk-green">
            {agents.filter((a) => a.status === 'active').length}
          </div>
          <div className="text-sm text-text-secondary">Active Agents</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">
            {agents.reduce((sum, a) => sum + a.tasksToday, 0)}
          </div>
          <div className="text-sm text-text-secondary">Total Tasks Today</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">
            {recentDecisions.length}
          </div>
          <div className="text-sm text-text-secondary">Recent Decisions</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-risk-green">99.8%</div>
          <div className="text-sm text-text-secondary">System Uptime</div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentActivity;
