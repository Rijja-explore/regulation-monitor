# Customization Guide

## 🎨 Changing Colors

All colors are defined in two places for easy customization:

### 1. CSS Variables (index.css)
```css
:root {
  /* Base Colors */
  --bg-primary: #0B1220;
  --bg-card: #111A2E;
  --border-color: #1F2A44;
  --text-primary: #E6EAF2;
  --text-secondary: #9AA4BF;
  
  /* Risk Colors */
  --risk-green: #1DB954;
  --risk-amber: #F4C430;
  --risk-red: #E5484D;
  
  /* Accent */
  --accent-blue: #1A73E8;
}
```

### 2. Tailwind Config (tailwind.config.js)
```javascript
colors: {
  'bg-primary': '#0B1220',
  'bg-card': '#111A2E',
  'border-color': '#1F2A44',
  'text-primary': '#E6EAF2',
  'text-secondary': '#9AA4BF',
  'risk-green': '#1DB954',
  'risk-amber': '#F4C430',
  'risk-red': '#E5484D',
  'accent-blue': '#1A73E8',
}
```

**Update both files to maintain consistency.**

---

## 🎬 Animation Tuning

### Global Page Transitions
**Location**: All pages  
**File**: Each page component

```jsx
// Adjust these values:
initial={{ opacity: 0, y: 12 }}     // Start state
animate={{ opacity: 1, y: 0 }}      // End state
transition={{ duration: 0.3 }}      // Speed (0.2-0.5s recommended)
```

### Violation Pulse Speed
**Location**: GoalGraph.js  
**Line**: ~60

```jsx
// Change duration for faster/slower pulse:
transition={{ repeat: Infinity, duration: 2 }}  // Try 1.5 or 3
```

### Agent Breathing Pulse
**Location**: AgentActivity.js  
**Line**: ~150

```jsx
// Adjust breathing intensity:
animate={{ scale: [1, 1.05, 1] }}  // Try 1.03 (subtle) or 1.08 (stronger)
transition={{ duration: 1.5 }}     // Try 1.0 (faster) or 2.0 (slower)
```

### Stagger Delays
**Location**: ComplianceOverview.js, others  

```jsx
// Control how quickly items appear:
transition={{ delay: index * 0.1 }}  // Try 0.05 (faster) or 0.15 (slower)
```

---

## 📊 Data Customization

### Compliance Status
**File**: ComplianceOverview.js  
**Line**: 7

```javascript
const complianceStatus = 'AT RISK';  
// Options: 'COMPLIANT' | 'AT RISK' | 'NON-COMPLIANT'
```

### Active Risks
**File**: ComplianceOverview.js  
**Line**: 17

```javascript
const activeRisks = [
  {
    id: 1,
    severity: 'red',  // 'red' | 'amber' | 'green'
    title: 'Your risk title',
    description: 'Your description',
  },
  // Add more risks...
];
```

### Agent Activity Feed
**File**: ComplianceOverview.js  
**Line**: 32

```javascript
const agentActivity = [
  { 
    time: '10:15', 
    agent: 'Agent Name', 
    action: 'what the agent did' 
  },
  // Add more activity...
];
```

### Goal Graph Nodes
**File**: GoalGraph.js  
**Line**: 8

```javascript
const nodes = [
  { 
    id: 1, 
    type: 'regulatory',  // 'regulatory' | 'control' | 'violation'
    label: 'PCI-DSS 3.2.1', 
    x: 20,  // Position (0-100%)
    y: 20,  // Position (0-100%)
    status: 'at-risk',  // 'satisfied' | 'at-risk' | 'violated'
    // ... more properties
  },
];
```

---

## 🧭 Adding New Pages

### 1. Create Page Component
**File**: `src/pages/YourPage.js`

```jsx
import React from 'react';
import { motion } from 'framer-motion';

const YourPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="p-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-text-primary">
        Your Page Title
      </h2>
      {/* Your content */}
    </motion.div>
  );
};

export default YourPage;
```

### 2. Add Route
**File**: App.js

```jsx
import YourPage from './pages/YourPage';

// Add inside <Routes>:
<Route path="/your-path" element={<YourPage />} />
```

### 3. Add Navigation Item
**File**: components/Sidebar.js

```jsx
import { YourIcon } from 'lucide-react';

// Add to navItems array:
{ path: '/your-path', icon: YourIcon, label: 'Your Page' }
```

---

## 🎯 Animation Best Practices

### ✅ DO Use Animations For:
- Risk state changes
- Agent actions
- New violations appearing
- Important data updates
- Page transitions

### ❌ DON'T Use Animations For:
- Static text
- Tables with stable data
- Navigation (keep minimal)
- Reading-focused content
- Evidence documents

### Performance Tips:
1. **Avoid animating too many elements at once**
   - Use stagger delays (0.05-0.1s)
   - Limit to 10-15 animated items

2. **Prefer transform over position**
   ```jsx
   // Good (GPU-accelerated):
   animate={{ x: 0, scale: 1 }}
   
   // Avoid (causes reflow):
   animate={{ left: '0px', width: '100px' }}
   ```

3. **Disable animations for accessibility**
   ```jsx
   const prefersReducedMotion = window.matchMedia(
     '(prefers-reduced-motion: reduce)'
   ).matches;
   
   transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
   ```

---

## 🔧 Common Customizations

### Change Sidebar Width
**File**: components/Sidebar.js (line 13) + App.js (line 15)

```jsx
// Sidebar.js
<aside className="w-64 ...">  // Change w-64 to w-72 or w-80

// App.js
<main className="ml-64 ...">  // Match the sidebar width (ml-72 or ml-80)
```

### Adjust Card Spacing
**Global padding**: Change `p-6` to `p-4` or `p-8` on card divs

### Font Size Adjustments
```jsx
// Headings
text-2xl → text-xl (smaller) or text-3xl (larger)

// Body text
text-sm → text-xs (smaller) or text-base (larger)
```

---

## 📦 Adding New Dependencies

```bash
# Charts
npm install recharts

# Date formatting
npm install date-fns

# More icons
npm install @lucide/react  # (already installed)
```

---

## 🐛 Troubleshooting

### Animation Not Working?
1. Check if Framer Motion is imported: `import { motion } from 'framer-motion'`
2. Ensure component is wrapped in `<motion.div>` not `<div>`
3. Verify transition object has proper syntax

### Colors Not Applying?
1. Check Tailwind class names match config
2. Restart dev server after changing Tailwind config
3. Use browser DevTools to inspect actual CSS

### Page Not Showing?
1. Verify route in App.js
2. Check component import path
3. Ensure component is exported: `export default YourComponent`

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all imports are correct
3. Review component props and data structure

**Happy Customizing! 🚀**
