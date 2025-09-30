# Design Guidelines: RecyclaTrack - Smart Recycling Management App

## Design Approach: Material Design + Eco-Conscious Aesthetics

**Selected Framework:** Material Design with environmental sustainability theming  
**Rationale:** This utility-focused IoT application requires clear information hierarchy, strong visual feedback for container status, and excellent accessibility support. Material Design provides robust patterns for maps, data visualization, and mobile-first experiences while allowing customization for the eco-conscious brand identity.

**Key Design Principles:**
- **Clarity First:** Information density must never compromise readability
- **Status at a Glance:** Container fill levels should be instantly recognizable
- **Accessible by Design:** Audio features and high contrast for all users
- **Motivational Feedback:** Reward visualization encourages continued engagement

---

## Core Design Elements

### A. Color Palette

**Primary Colors (Brand Identity):**
- Primary Green: 142 71% 45% (Forest green for brand, buttons, active states)
- Primary Light: 142 65% 55% (Lighter variant for hover states)
- Primary Dark: 142 75% 35% (Darker for text on light backgrounds)

**Functional Status Colors:**
- Success/Empty: 142 71% 45% (Container available - green)
- Warning/Medium: 45 93% 47% (Container half-full - amber/orange)
- Error/Full: 0 84% 60% (Container full - red)
- Info Blue: 210 100% 50% (Notifications, links)

**Neutral Palette (Dark Mode Optimized):**
- Background Dark: 220 15% 10%
- Surface Dark: 220 15% 15%
- Surface Elevated: 220 15% 20%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%
- Border Subtle: 220 10% 25%

**Light Mode:**
- Background Light: 0 0% 98%
- Surface Light: 0 0% 100%
- Text Dark Primary: 220 15% 15%
- Text Dark Secondary: 220 10% 40%

### B. Typography

**Font Stack:** 
- Primary: 'Inter' via Google Fonts - modern, highly legible
- Monospace: 'JetBrains Mono' for statistics/data displays

**Type Scale:**
- Hero/Display: text-4xl to text-6xl, font-bold (map headings)
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg to text-xl, font-semibold
- Body Text: text-base, font-normal (instructions)
- Small/Caption: text-sm, font-medium (metadata, timestamps)
- Micro/Labels: text-xs, font-medium uppercase (badges, status labels)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: p-2, gap-2 (tight elements)
- Component padding: p-4, p-6 (cards, buttons)
- Section spacing: p-8, py-12 (page sections)
- Major gaps: gap-8, gap-12, mt-16 (between major sections)

**Responsive Grid:**
- Mobile: Single column, full width with px-4 container
- Tablet: 2-column layouts for lists (md:grid-cols-2)
- Desktop: max-w-7xl centered, 3-column grids where appropriate

### D. Component Library

**Navigation:**
- Bottom navigation bar (mobile-first): 4 main sections with icons
- Top app bar: minimal, shows current location/page title
- Floating action button for quick "Find nearest container"

**Map Components:**
- Custom map markers: Circle indicators with fill-level gradient
- Marker size: Base 40px, selected 56px (scale-125 transform)
- Cluster badges: Rounded pills showing container count
- Info popup: Elevated card (shadow-lg) with container details

**Container Cards:**
- Material elevation: shadow-md, hover:shadow-lg transition
- Status badge: Absolute positioned top-right, rounded-full
- Icon indicators: 24px for material types (glass, plastic, paper, metal)
- Progress bar: Height h-2, rounded-full, gradient based on fill level

**Instruction Components:**
- Accordion panels for material categories (glass, plastic, paper)
- Audio button: Prominent, rounded-lg, with speaker icon (Heroicons)
- Step-by-step cards: Numbered circles, connecting lines
- Image placeholders: rounded-lg, aspect-video for preparation demos

**Notification System:**
- Toast notifications: Bottom position, slide-up animation
- In-app notification center: List with unread indicators (blue dot)
- Alert cards: Border-l-4 with status color, icon-left alignment

**Profile/Statistics:**
- Stat cards: Large numbers (text-4xl font-bold), small labels below
- Progress rings: Circular progress (use chart library), eco green fill
- Achievement badges: grid-cols-3 on mobile, grid-cols-5 desktop
- Timeline/History: Vertical line with dots, grouped by date

**Forms & Inputs:**
- Dark mode optimized: bg-surface with border focus ring in primary color
- All inputs: rounded-lg, p-4 minimum touch target (44px)
- Search bar: Prominent, with location icon prefix, filter chips below

### E. Interactive Elements

**Buttons:**
- Primary CTA: bg-primary rounded-lg px-6 py-3, white text
- Secondary: variant="outline" with primary border
- Icon buttons: Square 44px minimum, rounded-full for floating actions
- Disabled state: opacity-50, cursor-not-allowed

**Micro-interactions (Use Sparingly):**
- Map zoom: Smooth scale transform on container selection
- Fill level animation: Progress bar fills on data update (max 500ms)
- Success feedback: Subtle scale-105 bounce when action completes
- Loading states: Shimmer effect for skeleton screens

**Accessibility Features:**
- High contrast mode toggle in settings
- Audio playback controls: Play/pause/speed controls, clear icons
- Focus indicators: 2px ring in primary color, 2px offset
- Touch targets: Minimum 44px tap area for all interactive elements

---

## Screen-Specific Guidelines

### Screen 1: Map & Container Locator
- Full-height map (h-screen minus navigation)
- Sticky search bar with current location chip
- Floating filter chips: "Available only", "By material type"
- Bottom sheet (slide-up) for container list view alternative

### Screen 2: Container Details & Instructions
- Hero section: Large container image/icon, status banner across top
- Material acceptance grid: 2-column on mobile, 4-column desktop
- Instruction cards: Expandable accordions with icons
- Sticky audio control bar when instructions are playing

### Screen 3: Profile & Rewards
- Hero stats card: Total recycled (kg), Points, Streak days
- Achievement grid: Unlocked badges highlighted, locked in grayscale
- Impact visualization: Simple bar chart showing monthly contribution
- Leaderboard section (optional): Top 10, user's position highlighted

---

## Images

**Map Markers:** Use custom SVG icons from Heroicons library (location-marker with fill indicator)  
**Material Icons:** Heroicons 24px solid - archive-box, light-bulb, newspaper, beaker for material types  
**Profile Avatars:** Circular placeholders with user initials fallback  
**Achievement Badges:** Use SVG illustrations via placeholder comments (<!-- CUSTOM BADGE: Tree planted badge -->)  
**Instruction Images:** Aspect-video placeholders with descriptive comments for preparation steps

**No Large Hero Images** - This is a utility app focused on maps and functional content. Hero sections are data-driven (map view, stats dashboard) rather than image-based.