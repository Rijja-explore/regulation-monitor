import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ComplianceOverview from './pages/ComplianceOverview';
import GoalGraph from './pages/GoalGraph';
import LiveMonitoring from './pages/LiveMonitoring';
import Remediation from './pages/Remediation';
import Evidence from './pages/Evidence';
import AgentActivity from './pages/AgentActivity';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-bg-primary">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<ComplianceOverview />} />
            <Route path="/goal-graph" element={<GoalGraph />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/remediation" element={<Remediation />} />
            <Route path="/evidence" element={<Evidence />} />
            <Route path="/agents" element={<AgentActivity />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
