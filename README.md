# Agentic AI Compliance Platform

Enterprise-grade Visa/Banking UI for Continuous PCI/PII Compliance Monitoring

## 🎯 Overview

This is a production-ready React application demonstrating an **Agentic AI-Enabled Continuous Compliance Platform** designed for banking, payments, and regulatory compliance use cases. The UI communicates **intelligence, trust, and causality** through carefully crafted animations and professional design.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **CSS Processing**: PostCSS

## 🎨 Design Philosophy

### Animation Principles
Animations communicate **State • Confidence • Intelligence • Causality**, not decoration.

**✅ Flashy When:**
- A risk appears
- An agent takes action
- A violation is detected
- A goal graph updates

**❌ Minimal When:**
- Navigating menus
- Reading tables
- Viewing evidence

**Rule:** Flash = signal, not decoration.

### Color Scheme (Visa/Banking-Grade)

#### Base Colors
- Background: `#0B1220`
- Card Surface: `#111A2E`
- Border/Divider: `#1F2A44`
- Primary Text: `#E6EAF2`
- Secondary Text: `#9AA4BF`

#### Risk Colors
- 🟢 Compliant: `#1DB954`
- 🟡 At Risk: `#F4C430`
- 🔴 Non-Compliant: `#E5484D`

#### Accent
- Visa-safe Blue: `#1A73E8`

## 📁 Project Structure

```
src/
├── components/
│   └── Sidebar.js          # Persistent left navigation
├── pages/
│   ├── ComplianceOverview.js    # Page 1: Landing dashboard
│   ├── GoalGraph.js             # Page 2: Visual compliance graph
│   ├── LiveMonitoring.js        # Page 3: Real-time violation detection
│   ├── Remediation.js           # Page 4: Automated actions
│   ├── Evidence.js              # Page 5: Audit trail
│   └── AgentActivity.js         # Page 6: Agent reasoning
├── App.js                  # Main routing configuration
├── index.css              # Global styles + Tailwind
└── index.js               # Entry point
```

## 🏠 Pages Overview

### 1. Compliance Overview
**Purpose**: In 5 seconds, tell if the organization is compliant and why.

**Features**:
- Global compliance status card with glow animation
- Regulatory risk heatmap table
- Active risks with staggered slide-in animations
- Autonomous agent activity timeline

**Animations**:
- Scale-in for status card
- Staggered slide from right for risk cards
- Fade + upward motion for agent feed

---

### 2. Compliance Goal Graph
**Purpose**: Show compliance as structured, explainable, and executable.

**Features**:
- Interactive node graph (regulations, controls, violations)
- Pulsing glow on violation nodes
- Expandable details panel
- Goal status summary

**Animations**:
- Node scale-in with stagger
- Slow pulse for violations (allowed flashy)
- Panel slide from right
- Hover scale effects

---

### 3. Live Monitoring
**Purpose**: Is something going wrong right now?

**Features**:
- Data source tabs (Transactions, Chats, Documents)
- Live data viewer with PAN detection
- Red highlight + shake animation for violations
- Sticky violation context card

**Animations**:
- Tab underline motion
- One-time shake for PAN detection (allowed flashy)
- Soft glow on context card

---

### 4. Remediation & Actions
**Purpose**: What is the system doing about the problem?

**Features**:
- Active remediation task cards
- State-based animations (planned/executing/completed)
- AI-generated recommendations
- Human-in-the-loop approval controls

**Animations**:
- Executing state: animated background sweep
- Progress bars with smooth transitions
- Opacity fade for completed tasks

---

### 5. Evidence & Audit Trail
**Purpose**: Can you prove compliance to an auditor?

**Features**:
- Chronological incident timeline
- Evidence artifact downloads
- Chain of custody documentation

**Animations**:
- Minimal: fade-in only
- No flash (communicates stability)
- Hover highlight on artifacts

---

### 6. Agent Activity
**Purpose**: Are the agents actually thinking?

**Features**:
- Agent status indicators (Active/Waiting/Idle)
- Recent decision reasoning traces
- System health metrics

**Animations**:
- Breathing pulse for active agents
- Dotted progress for waiting agents
- Staggered entry for cards

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 🎭 Demo Narrative

"Each page corresponds to a stage in autonomous compliance — **awareness, reasoning, detection, action, and proof**."

### Demo Flow:
1. **Overview** → See global compliance state
2. **Goal Graph** → Understand structured compliance goals
3. **Monitoring** → Detect violations in real-time
4. **Remediation** → Watch autonomous fixes
5. **Evidence** → Review audit trail
6. **Agents** → Examine AI reasoning

## 🧠 Key Features

### Agentic AI Components
- **Regulation Agent**: Monitors regulatory updates
- **Policy Agent**: Maintains compliance policies
- **Monitoring Agent**: Scans data for violations
- **Remediation Agent**: Executes fixes

### Enterprise-Grade UI
- No clutter
- Large spacing
- Conservative typography
- Risk colors only for risk
- Motion only for meaning

### Judge-Ready
Designed to impress banking, payments, and AI judges with:
- Professional animations
- Clear causality
- Explainable AI decisions
- Audit-ready evidence

## 📊 Animation Reference

### Global Page Transitions
```jsx
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -12 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

### Violation Pulse (Flashy - Allowed)
```jsx
animate={{
  boxShadow: [
    '0 0 0px rgba(229,72,77,0)',
    '0 0 18px rgba(229,72,77,0.6)',
    '0 0 0px rgba(229,72,77,0)'
  ]
}}
transition={{ repeat: Infinity, duration: 2 }}
```

### Agent Breathing Pulse
```jsx
animate={{ scale: [1, 1.05, 1] }}
transition={{ repeat: Infinity, duration: 1.5 }}
```

## 🔒 Compliance Standards

- **PCI-DSS 3.2.1**: Payment Card Industry Data Security Standard
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **SOX**: Sarbanes-Oxley Act

## 📝 License

MIT

---

**Built for banking infrastructure software. Not a consumer app. Not a startup landing page.**

*Judges will subconsciously think:*
- ❌ No animation → static mockup
- ❌ Too flashy → unserious
- ✅ **State-driven animation → intelligent system**

