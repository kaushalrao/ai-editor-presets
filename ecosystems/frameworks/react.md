---
description: FRONTEND: React, Next.js, HTML, CSS, Tailwind, UI/UX, and Design System standards.
globs: ["**/*.jsx", "**/*.tsx", "**/*.js", "**/*.ts"]
alwaysApply: false
---
## Frontend Development

**Goal:** High-density, minimalist Enterprise SaaS (Aesthetic: Linear, Vercel, Stripe).

### React Best Practices

- **Components:** Functional components only. Never use class components.
- **State Management:** Use Hooks (`useState`, `useReducer`). Prefer Context API or Zustand for global state over Redux unless mandated.
- **Hooks:** Follow the Rules of Hooks. Keep custom hooks purely logical, returning state and handlers, no JSX. Use `useMemo` and `useCallback` appropriately to prevent unnecessary re-renders.
- **Types:** Always use TypeScript (`.tsx`). Define explicit interfaces or types for component props. Avoid `any`.
- **Side Effects:** Keep `useEffect` dependencies accurate. Avoid fetching data in `useEffect` for complex apps; prefer React Query, SWR, or Next.js server components/actions.
- **File Structure:** One component per file. Place tests (`.test.tsx`) alongside components. Colocate styles and sub-components.

### User Journey Analysis (Before Coding)

Output `<user_journey_analysis>`:

1. Persona: Who is this for? Technical proficiency?
2. Job to be Done: Single primary goal of screen
3. Spatial Architecture: Screen division (Sidebar nav, central table, details drawer)
4. Interaction Model: Key patterns (Keyboard-heavy data entry, read-only dashboard)
5. Layout & User Journey: How layout facilitates user decision

### UI Design System

**Visual Philosophy (Card-less Design):**

- Avoid Card Bloat. No white boxes with shadows unless draggable/isolated widgets
- Separation: Subtle borders (Custom Grey `#C4BEB6`)
- Backgrounds: 95% White (`#FFFFFF`) or Light Gray (`#F9F9F9`)
- Shadows: Only for Z-axis elevation (Modals, Popovers). Static elements flat
- Aesthetic: Modern, minimalist, technically precise

**Typography:**

- Font: Inter, Roboto, or SF Pro
- Tabular Numbers: CRITICAL. Apply `font-variant-numeric: tabular-nums` to financial data, dates, IDs, counts
- Hierarchy: Font weight and color contrast

**Corporate Color Palette:**

```javascript
colors: {
  brand: {
    red: '#E1140A',    // Logos, Active Nav, Destructive actions
    blue: '#3E8DDD',   // PRIMARY ACTIONS (Buttons, Links), Focus rings
    purple: '#8246AF', // Data visualization, Feature highlights
    orange: '#FF6A00', // Warnings
    green: '#6AC346',  // Success states
  },
  neutral: {
    50:  '#F9F9F9', // Canvas / Table Headers
    100: '#F2F2F2', // Hover States
    200: '#E2E8F0', // Light Borders
    300: '#C4BEB6', // Strong Borders (Input fields)
    500: '#6F7170', // Secondary Text / Metadata
    900: '#333F48', // Primary Text / Headings
  }
}
```

**Usage:**

- Canvas: `bg-white`
- Primary Text: `text-neutral-900` (Headings)
- Secondary Text: `text-neutral-500` (Body/metadata)
- Borders: `border-neutral-300` or `border-neutral-200`
- Primary Action: `brand-blue` (Save, Submit, New)
- Brand Accent: `brand-red` (Active nav, logos, destructive)
- Success/Warning/Error: `brand-green`, `brand-orange`, `brand-red`

**Component Standards:**

- Primary Button: `bg-brand-blue hover:bg-opacity-90 text-white`
- Secondary Button: `border-neutral-300 text-neutral-500 hover:bg-neutral-50`
- Destructive Button: `text-brand-red hover:bg-red-50`
- Data Tables: Header `bg-neutral-50 text-neutral-900`, Selection `bg-brand-blue/10`
- Focus Rings: `ring-brand-blue`

**Implementation:**

- Framework: React (Vite)
- Styling: Tailwind CSS (define custom colors in config)
- Icons: Lucide-React
- Full responsive implementation
