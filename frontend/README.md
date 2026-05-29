
## SpaceExplorer 2.0 — Full Frontend Requirements

---

### Project identity

Built a complete, multi-page frontend for **"Mission Control: Space Explorer"** — a space agency dashboard for managing real and fictional space operations. The interface must feel like an actual NASA/ESA-grade mission control system: dark, immersive, data-dense, professional, and alive. Not a toy. Not a template. A real product someone would pay to use.

**Tech stack:** Pure HTML, CSS, and vanilla JavaScript only. No frameworks, no libraries except what is listed explicitly below. Single-page application (SPA) with JavaScript-powered routing between pages — no page reloads.

**Allowed external libraries (CDN only):**
- Chart.js (for data visualizations)
- Particles.js or tsParticles (for animated star field background)
- Flatpickr (for date pickers)
- Tippy.js (for tooltips)
- Animate.css (for entrance animations)

---

### Visual design system

**Color palette :**
```
--bg-void:        #03040a       /* deepest background, space black */
--bg-deep:        #070b14       /* page background */
--bg-surface:     #0d1424       /* cards, panels */
--bg-elevated:    #111d35       /* hover states, inputs */
--bg-glass:       rgba(13,20,36,0.7)  /* glassmorphism panels */

--accent-primary: #00d4ff       /* electric cyan — primary brand color */
--accent-glow:    #0099cc       /* darker cyan for shadows */
--accent-pulse:   #00ffcc       /* mint green — secondary accent */
--accent-warn:    #ff6b35       /* mission-critical orange */
--accent-danger:  #ff3366       /* alert red */
--accent-gold:    #ffd700       /* achievements, leaderboard gold */

--text-primary:   #e8f4ff       /* main text */
--text-secondary: #7a9bbf       /* muted text */
--text-dim:       #3d5a7a       /* disabled / very muted */

--border-subtle:  rgba(0,212,255,0.12)
--border-active:  rgba(0,212,255,0.4)
--border-glow:    rgba(0,212,255,0.7)
```

**Typography:**
- Imported from Google Fonts: `Orbitron` (headings — gives the sci-fi feel), `Inter` (body text — readable and clean), `JetBrains Mono` (data values, coordinates, numbers)
- Headings: Orbitron, 500 weight
- Body: Inter, 400/500 weight
- Data: JetBrains Mono for any number, stat, coordinate, countdown timer, or technical value

**Core visual language:**
- Everything lives on a dark void background with a subtle animated star field (tsParticles) running site-wide
- Cards use glassmorphism: `background: var(--bg-glass); backdrop-filter: blur(12px); border: 1px solid var(--border-subtle)`
- Glowing borders on hover: box-shadow that uses `--accent-glow` color
- Subtle scan-line texture overlay on the entire page (CSS repeating gradient, very low opacity ~3%)
- Corner brackets on important cards (CSS pseudo-elements making ⌐ ¬ shapes in the corners — a classic HUD aesthetic)
- All interactive elements have a transition of `0.2s ease` minimum
- Status indicators use pulsing dot animations (CSS `@keyframes pulse`)
- Section dividers use a gradient line: `linear-gradient(90deg, transparent, var(--accent-primary), transparent)`

---

### Layout architecture

**Global layout:**
- Left sidebar navigation: 72px collapsed by default, expands to 240px on hover (icon + label revealed)
- Top header bar: 56px tall, shows current page title, mission clock (counting up from a launch date), user avatar placeholder, and a notification bell icon with a badge
- Main content area: fills remaining space, 24px padding, scrollable
- Right info panel: 280px wide, slides in/out on certain pages (mission details, astronaut profile)

**Sidebar navigation items (with icons — used SVG inline icons, no icon library):**
1. Mission Control (home dashboard)
2. Active Missions
3. Crew Roster
4. Discovery Log
5. Observation Log 
6. Live Launches 
7. Leaderboard 
8. Search & Database
9. Settings / Profile 

Each nav item has: an SVG icon, a label, and an active state with a left cyan border glow and highlighted background.

---

### Page specifications 

---

#### Page 1: Mission Control Dashboard (home)

This is the hero page. It  feel like an actual mission control room display.

**Top row — 4 stat cards:**
Each card has: an icon, a large animated number counter (counts up on load), a label, and a small trend indicator (↑ or ↓ with a percentage). Stats: Active Missions, Crew Deployed, Discoveries Logged, Launch Success Rate. Numbers animate from 0 to their value using a JS easing function over 1.5 seconds on page load.

**Center hero — Live Mission Feed:**
A horizontal scrolling row of "mission cards." Each mission card is 300px wide and shows:
- Mission name in Orbitron font
- A status badge: ACTIVE (pulsing green dot), COMPLETED (static blue), FAILED (red), PLANNING (amber)
- Destination with a small planet/location icon
- Launch date countdown timer (live, updates every second, shows `T-minus DDd HHh MMm SSs` format in JetBrains Mono)
- A thin progress bar showing mission completion percentage
- Crew count
- A "VIEW DETAILS" button that opens the right info panel

**Bottom left — Discovery chart:**
A Chart.js doughnut chart showing discovery types (Geological, Astronomical, Biological, Chemical, Technological) using the brand colors. Animated on load. Hoverable slices show counts in a tooltip.

**Bottom center — Mission timeline:**
A vertical timeline showing the 5 most recent events (mission launched, astronaut registered, discovery logged, etc.) with timestamps and color-coded event type icons.

**Bottom right — Crew status:**
A mini-roster showing astronaut name, rank badge, and their current mission assignment status (DEPLOYED, STANDBY, OFF-DUTY). Each row is clickable.

---

#### Page 2: Active Missions

**Top filter bar:** Tabs for ALL / ACTIVE / COMPLETED / FAILED / PLANNING. Click to filter the grid below. Tab has an underline indicator that slides with CSS transition.

**Mission grid:** Responsive CSS Grid, 3 columns on desktop. Each card has:
- Full-bleed header area with a CSS-generated space gradient unique to each mission (use the mission name as a seed for hue rotation)
- Corner bracket decorations (CSS pseudo-elements)
- Mission name, destination, launch date, duration
- A mini crew avatar stack (overlapping circles with initials)
- Priority badge: LOW / MEDIUM / HIGH / CRITICAL — each a different color
- Two action buttons: DETAILS and EDIT (both open modals, no page reload)

**Add Mission button:** Floating action button (FAB) in bottom-right, opens a slide-in panel from the right with the full mission form:
- Mission name (text input)
- Destination (text with autocomplete suggestions: Mars, Europa, Titan, Moon, Asteroid Belt, Deep Space)
- Objective (textarea with character counter)
- Launch date (Flatpickr datepicker)
- Duration (text)
- Priority (custom styled select with color-coded options)
- Crew size (number stepper with + / − buttons)
- On submit: success toast notification appears bottom-right, slides in and out

---

#### Page 3: Crew Roster

**Header actions:** Search input (live filter), Filter by Rank dropdown, Filter by Specialty dropdown, Toggle between Grid view and Table view (animated transition between the two layouts).

**Grid view — Astronaut cards:**
Each card styled like an ID badge or personnel file:
- Top section: circular avatar placeholder with initials, styled in a gradient based on name hash. A subtle hex-grid background pattern behind the avatar area
- Rank badge (COMMANDER, CAPTAIN, SPECIALIST, PILOT, TRAINEE) — pill-shaped with appropriate color
- Name in Orbitron, specialty and experience below
- Current mission assignment (or "AVAILABLE" in green if unassigned)
- Skill bars: 3 attributes shown as thin progress bars (e.g., Leadership 85%, Technical 90%, Physical 72%)
- Action buttons: ASSIGN TO MISSION, VIEW PROFILE

**Table view:**
A proper data table with: sortable column headers (click to sort, arrow indicator), alternating row shading, sticky header, inline status badges, and pagination (10 rows per page with prev/next).

**Add Astronaut FAB:** Same slide-in panel pattern as missions:
- Full name, rank (styled select), specialty (styled select), experience (number), nationality (text input), bio (textarea)

---

#### Page 4: Discovery Log

**Hero section:** A large banner showing "Total Discoveries: [number]" and a real-time updated "Latest Discovery" ticker (rotating through logged discoveries like a news ticker, smooth CSS marquee animation).

**Filter sidebar (inline, not a separate panel):** Checkboxes for discovery type, a date range picker, a location search. Filters apply in real-time as the user changes them, animating items in/out with opacity and transform transitions.

**Discovery cards — Masonry-style grid:**
Each card:
- A type icon area: Geological (mountain SVG), Astronomical (star SVG), Biological (DNA SVG), Chemical (atom SVG), Technological (circuit SVG) — each with a unique color theme
- Discovery title in Orbitron
- Location in JetBrains Mono with coordinate-style formatting (e.g., `LAT: 23.5° | LON: 118.2°`)
- Discovered by (astronaut name)
- Date logged
- Significance rating: 1–5 stars, displayed as glowing star SVGs
- Description excerpt (truncated to 3 lines with a "Read more" expander)
- A share button (copies a text summary to clipboard with a toast confirmation)

**Log Discovery FAB:** Same slide-in pattern, form includes all fields plus a significance slider (1–5 with live star preview).

---

#### Page 5: Observation Log 

This page is for amateur astronomers logging personal sky observations. It has a different, more personal feel than the other pages — slightly more journal-like while still matching the design system.

**Top: "Tonight's Sky" banner:**
Shows current date, a placeholder for "Visible tonight from your location" with a button that says "Enable Location" (no actual API call needed — just show a sample star visibility list like "Jupiter — visible at 22:00, Venus — visible at 20:30, ISS pass — 21:47").

**Observation cards:**
More compact than discovery cards. Shows: object observed (e.g., "Jupiter"), equipment used (telescope model), conditions (Seeing: Excellent / Good / Poor as a colored badge), notes excerpt, date/time, and location name. Cards fan out slightly on hover (CSS transform rotate a few degrees, very subtle).

**Log New Observation form (FAB → slide-in panel):**
- Object name (text)
- Object type (Planet, Star, Galaxy, Nebula, Comet, Satellite, Other)
- Date & time (Flatpickr with time)
- Location (text, e.g., "Lahore, Pakistan")
- Equipment used (text, e.g., "Celestron 8-inch SCT")
- Seeing conditions (3-option radio styled as toggle buttons: Poor / Good / Excellent)
- Sky darkness (Bortle scale 1–9, a styled range slider)
- Notes (textarea)
- Rating (star selector)

**Stats sidebar:** Shows user's total observations, most observed object, best seeing conditions logged, and a small Chart.js bar chart of observations per month.

---

#### Page 6: Live Launches 

This page is designed to look like a real launch operations display.

**Hero countdown:** A large, centered countdown timer for the next upcoming launch. Design it like a digital clock — each digit in its own segmented box, styled with JetBrains Mono in a large font size. Shows mission name above, rocket name and launch site below. Counts down live.

**Launch cards grid:** Cards for 5–8 upcoming/recent launches (use hardcoded realistic placeholder data — SpaceX Falcon 9, Artemis, Starship, etc.). Each card:
- Launch provider logo placeholder (just a circle with initials)
- Mission name + rocket name
- Launch site (e.g., Kennedy Space Center, LC-39A)
- NET (No Earlier Than) date in large JetBrains Mono
- Status: GO FOR LAUNCH (green pulsing), HOLD (amber), SCRUBBED (red), LAUNCHED (blue)
- A "T-minus" mini countdown if within 7 days
- "Follow Launch" bookmark toggle button (toggles a star icon, saves to localStorage)

**Recent launches section:** A horizontal scrolling row of past launches with success/failure status and a brief outcome note.

**Bottom — Launch calendar:** A simple CSS-drawn calendar grid for the current month with dots on launch dates. Hovering a dot shows a tooltip (Tippy.js) with the mission name.

---

#### Page 7: Leaderboard 

**Hero podium:** Top 3 users displayed on a visual podium (1st place center and tallest, 2nd left, 3rd right). Each position shows: rank number, user avatar (circle with initials), username, and total points. Gold/Silver/Bronze color theming. CSS-animated confetti-style particles on the gold position.

**Full rankings table:** Below the podium, a scrollable table:
- Rank number (with medal icons for top 3)
- Avatar + username
- Points total in JetBrains Mono with a gold color
- Breakdown mini-bar showing points from: Missions (blue), Discoveries (teal), Observations (green), Community (coral)
- Level badge (CADET → PILOT → SPECIALIST → COMMANDER → ADMIRAL based on point thresholds)
- Last active date

**Points system explanation:** A collapsible section explaining how points are earned:
- +50 pts: Log a new discovery
- +30 pts: Complete a mission
- +20 pts: Log an observation
- +10 pts: Register an astronaut
- +100 pts: First to log a new discovery type this week

**Achievement badges row:** A horizontal scrolling grid of achievement badges (CSS-drawn hexagon shapes with icons and labels): "First Launch", "10 Observations", "Mission Commander", etc. Locked ones are dimmed with a lock icon overlay.

---

#### Page 8: Search & Database

**Search hero:** A large centered search input with a glowing border, placeholder text "Search missions, crew, discoveries...", and animated typing effect in the placeholder that cycles through example queries. Below it, category filter pills: ALL / MISSIONS / CREW / DISCOVERIES / OBSERVATIONS.

**Results:** Appear below the search bar as the user types (debounced at 300ms). Results are grouped by category with a count. Each result row shows type icon, name, a brief description, and a "View" button.

**Full database tables section:** Below the search, tabbed view of all data tables:
- Missions table
- Astronauts table
- Discoveries table
- Observations table

Each table: sortable headers, live filter input, column visibility toggle, export button (generates a simple CSV from the table data using JS), pagination.

---

#### Page 9: Login / Register screen

Even though the backend auth (Module 4) isn't built yet, build the full UI.

**Layout:** Centered card on a full-screen background with the animated star field. The card has a split design: left half has a space image (CSS gradient scene with SVG stars, planets), right half has the form.

**Toggle between Login and Register:** Smooth CSS height/opacity transition, no page reload.

**Login form:** Email, password (with show/hide toggle), "Remember me" checkbox, "Forgot password?" link.

**Register form:** Username, email, password, confirm password, a role selector (RESEARCHER / ASTRONAUT / MISSION DIRECTOR — styled as clickable cards with icons, only one selectable at a time).

**Submit button:** Full-width, has a loading state (shows a spinner and "Authenticating..." text after click).

---

### Global components (build these as reusable JS functions/classes)

**Toast notifications:** `showToast(message, type)` — type can be `success`, `error`, `warning`, `info`. Toast slides in from bottom-right, stays 3.5 seconds, has a progress bar depleting. Stack multiple toasts vertically.

**Modal system:** `openModal(title, content, actions)` — a centered overlay with backdrop blur, close on backdrop click or Escape key, entrance animation (scale from 0.9 + fade in).

**Slide-in panel:** `openPanel(title, formHTML)` — slides in from right, 480px wide, overlay backdrop, close button. All add/edit forms live in panels.

**Confirmation dialog:** `confirmAction(message, onConfirm)` — appears before deletes. Two buttons: CANCEL and CONFIRM (red). Shakes on second click if user hesitates.

**Loading skeleton:** When content would load from an API, show skeleton loaders (animated shimmer placeholders matching the card shape) for 800ms before revealing content.

**Empty state:** When a list has no items, show a centered SVG illustration (simple line art of an astronaut floating) with a message and an add button. Never show a blank space.

---

### Micro-interactions and animations (these make it extraordinary)

- **Page transitions:** When switching pages via the sidebar, the outgoing page fades out and slides left 20px while the incoming page fades in from the right. Duration: 250ms.
- **Card hover:** `transform: translateY(-4px)` + border glow intensifies. Duration: 200ms.
- **Button press:** `transform: scale(0.97)` on mousedown, back on mouseup.
- **Stat counters:** On dashboard load, all numbers animate from 0 using an ease-out cubic function.
- **Status badges:** ACTIVE and GO FOR LAUNCH badges have a continuously pulsing glow (`@keyframes pulse-glow`).
- **Countdown timers:** When a digit changes, it flips with a brief Y-axis rotation (`@keyframes flip-digit`).
- **Navigation active indicator:** A vertical line on the left of the active nav item that slides vertically to the new item using CSS `top` transition when switching pages.
- **Sidebar expand:** Width transition with `overflow: hidden` so labels don't pop in.
- **Form validation:** Inputs shake horizontally (`@keyframes shake`) when submitted with invalid data. Valid inputs show a subtle green checkmark that fades in.
- **Leaderboard rows:** Entrance animation — rows slide in from left with staggered delays (each row 50ms after the previous).
- **Discovery cards:** Entrance animation — fade in + scale from 0.95, staggered across the grid.

---

### Data layer (JavaScript)

Since the backend is not connected yet, build a full **mock data layer** in a file called `data.js`:

- `MOCK_MISSIONS` array: 8 missions with realistic names (Artemis IX, Hermes-7, Project Cassini-2, etc.), varied statuses, dates, destinations, and crew sizes
- `MOCK_ASTRONAUTS` array: 12 astronauts with names, ranks, specialties, experience years, and assigned missions
- `MOCK_DISCOVERIES` array: 10 discoveries with all fields filled in
- `MOCK_OBSERVATIONS` array: 8 observations with realistic sky-watching data
- `MOCK_LAUNCHES` array: 6 upcoming + 4 recent launches with realistic rocket names and launch sites
- `MOCK_LEADERBOARD` array: 15 users with usernames, points, and breakdown

All pages must read from these arrays. All add forms must push to the arrays and re-render the relevant list. This makes the UI fully functional end-to-end before the backend exists. Use `localStorage` to persist any user-added data between page refreshes.

Build a simple `api.js` file with functions like `getMissions()`, `addMission(data)`, `getAstronauts()` etc. that currently just read/write the mock data. When the real backend is ready, only this file needs to change — the pages never call fetch directly.

---

### File structure

```
frontend/
├── index.html          ← single HTML file, all pages defined here as hidden divs
├── styles/
│   ├── base.css        ← variables, reset, typography, global elements
│   ├── layout.css      ← sidebar, header, main area, panel, grid systems
│   ├── components.css  ← cards, badges, buttons, forms, tables, modals, toasts
│   ├── pages.css       ← page-specific styles
│   └── animations.css  ← all @keyframes and transition utilities
├── scripts/
│   ├── router.js       ← SPA page switching logic
│   ├── data.js         ← mock data arrays
│   ├── api.js          ← data access layer (mock)
│   ├── components.js   ← toast, modal, panel, skeleton, empty state functions
│   ├── charts.js       ← all Chart.js initializations
│   ├── countdown.js    ← timer logic (used on dashboard + launches page)
│   └── pages/
│       ├── dashboard.js
│       ├── missions.js
│       ├── crew.js
│       ├── discoveries.js
│       ├── observations.js
│       ├── launches.js
│       ├── leaderboard.js
│       └── search.js
└── assets/
    └── (no images— all visuals are CSS/SVG)
```

---

### Accessibility and quality requirements

- All interactive elements are keyboard-accessible (Tab + Enter/Space)
- All form inputs have proper labels (use `aria-label` where visual label is absent)
- Color is never the only indicator of status — always pair with text or icon
- Focus states are visible (replace browser default with a custom `outline: 2px solid var(--accent-primary)`)
- Scrollable containers have `-webkit-overflow-scrolling: touch` for mobile smoothness
- The app must be fully usable at 1280px wide desktop minimum. Mobile layout is a bonus but not required.
- No console errors on load
- No `!important` abuse
- CSS custom properties for everything — no hardcoded color hex values in component CSS

---

### Final quality bar

When complete, the frontend should look indistinguishable from a real SaaS product that a space-tech startup would ship. If it looks like a student project or a template, it is not done. Every empty state, every loading state, every error state must be handled with a real UI. The star field must be running, the timers must be ticking, the charts must be animated, and navigating between pages must feel fluid and instantaneous.