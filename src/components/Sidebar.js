import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Network, Radio, Wrench, FolderOpen, Bot } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Compliance Overview' },
    { path: '/goal-graph', icon: Network, label: 'Compliance Goal Graph' },
    { path: '/monitoring', icon: Radio, label: 'Live Monitoring' },
    { path: '/remediation', icon: Wrench, label: 'Remediation & Actions' },
    { path: '/evidence', icon: FolderOpen, label: 'Evidence & Audit Trail' },
    { path: '/agents', icon: Bot, label: 'Agent Activity' },
  ];

  return (
    <aside className="w-64 bg-bg-card border-r border-border-color h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-border-color">
        <h1 className="text-xl font-semibold text-text-primary">
          Agentic Compliance
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          PCI/PII Continuous Monitoring
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-accent-blue text-white'
                        : 'text-text-secondary hover:bg-border-color hover:text-text-primary'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border-color">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} Compliance Platform
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
