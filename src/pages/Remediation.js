import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play } from 'lucide-react';

const Remediation = () => {
  const tasks = [
    {
      id: 1,
      title: 'Mask PAN in Ticket #3847',
      agent: 'Remediation Agent',
      status: 'executing',
      goal: 'Protect stored cardholder data',
      progress: 65,
    },
    {
      id: 2,
      title: 'Update Support SOP',
      agent: 'Policy Agent',
      status: 'planned',
      goal: 'Prevent future PAN exposure',
      progress: 0,
    },
    {
      id: 3,
      title: 'Generate Audit Evidence',
      agent: 'Monitoring Agent',
      status: 'executing',
      goal: 'Document compliance actions',
      progress: 40,
    },
    {
      id: 4,
      title: 'Redact Historical Chat Logs',
      agent: 'Remediation Agent',
      status: 'completed',
      goal: 'Protect stored cardholder data',
      progress: 100,
    },
  ];

  const recommendation = {
    title: 'AI-Generated Remediation Plan',
    content: 'Recommended remediation based on PCI-DSS: Mask card numbers at ingestion point in support chat system and redact all historical logs containing unmasked PANs. Implement automated detection and masking rules to prevent future violations.',
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={20} className="text-risk-green" />;
    if (status === 'executing') return <Play size={20} className="text-risk-amber" />;
    return <Clock size={20} className="text-text-secondary" />;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'border-risk-green';
    if (status === 'executing') return 'border-risk-amber';
    return 'border-text-secondary';
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
        Remediation & Actions
      </h2>

      {/* Active Remediation Tasks */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Active Remediation Tasks
        </h3>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              animate={{
                opacity: task.status === 'completed' ? 0.6 : 1,
                scale: task.status === 'executing' ? 1.02 : 1,
                backgroundPosition: task.status === 'executing' ? ['0%', '100%'] : '0%',
              }}
              transition={{
                backgroundPosition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              className={`bg-bg-card rounded-lg p-6 border-l-4 ${getStatusColor(task.status)}`}
              style={
                task.status === 'executing'
                  ? {
                      backgroundImage:
                        'linear-gradient(90deg, transparent 0%, rgba(26,115,232,0.1) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }
                  : {}
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">
                      {task.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                      Responsible: {task.agent}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-medium uppercase ${
                    task.status === 'completed'
                      ? 'bg-risk-green text-white'
                      : task.status === 'executing'
                      ? 'bg-risk-amber text-white'
                      : 'bg-text-secondary text-white'
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-text-secondary">
                  Impacted Goal: {task.goal}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-border-color rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-full ${
                      task.status === 'completed'
                        ? 'bg-risk-green'
                        : task.status === 'executing'
                        ? 'bg-risk-amber'
                        : 'bg-text-secondary'
                    }`}
                  ></motion.div>
                </div>
                <p className="text-xs text-text-secondary text-right">
                  {task.progress}% Complete
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI-Generated Recommendations */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          {recommendation.title}
        </h3>
        <p className="text-text-primary leading-relaxed">
          {recommendation.content}
        </p>
        <div className="mt-4 p-4 bg-border-color rounded">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-accent-blue">Next Steps:</span>
            <br />
            1. Approve automated masking rule deployment
            <br />
            2. Schedule historical data remediation (estimated 2 hours)
            <br />
            3. Update staff training materials
          </p>
        </div>
      </div>

      {/* Human-in-the-Loop */}
      <div className="bg-bg-card rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-text-primary">
          Human Approval Required
        </h3>
        <p className="text-text-secondary mb-4">
          The remediation plan above requires human authorization before execution.
        </p>
        <div className="flex gap-4">
          <button className="bg-accent-blue hover:bg-opacity-90 text-white px-6 py-2 rounded transition-colors">
            Approve All Actions
          </button>
          <button className="bg-border-color hover:bg-text-secondary text-text-primary px-6 py-2 rounded transition-colors">
            Review Individual Tasks
          </button>
          <button className="bg-transparent border border-risk-red text-risk-red hover:bg-risk-red hover:text-white px-6 py-2 rounded transition-colors">
            Override (Demo)
          </button>
        </div>
      </div>

      {/* Remediation Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">
            {tasks.filter((t) => t.status === 'completed').length}
          </div>
          <div className="text-sm text-text-secondary">Completed</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-risk-amber">
            {tasks.filter((t) => t.status === 'executing').length}
          </div>
          <div className="text-sm text-text-secondary">In Progress</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-secondary">
            {tasks.filter((t) => t.status === 'planned').length}
          </div>
          <div className="text-sm text-text-secondary">Planned</div>
        </div>
        <div className="bg-bg-card rounded-lg p-4">
          <div className="text-2xl font-bold text-text-primary">
            {Math.round(
              tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length
            )}
            %
          </div>
          <div className="text-sm text-text-secondary">Overall Progress</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Remediation;
