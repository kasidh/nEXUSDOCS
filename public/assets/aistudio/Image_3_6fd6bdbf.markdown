---
name: Sovereign Slate
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#006a7c'
  on-tertiary-container: '#93e8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-lg: 1.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system embodies the precision, technical mastery, and structural order demanded by modern enterprise dashboard ecosystems, infused with contemporary Iranian architectural geometry and modern Persian typographic discipline. It marries high-density information architecture with refined negative space, transitioning seamlessly across RTL (Persian) and bilingual Latin interfaces.

### Brand Personality & Demeanor
- **Architectural & Authoritative:** Inspired by contemporary Iranian geometric precision and masonry, layouts emphasize proportion, balanced modules, and crisp hierarchy.
- **Utilitarian Elegance:** High-density enterprise workflows demand clarity over ornamentation. The system eliminates decorative noise, relying instead on surgical micro-spacing and subtle tonal contrast.
- **Bilingual Fluidity:** Symmetrical structural rules ensure that contextual flow, navigation rails, and data-dense tables remain visually balanced whether rendered in Right-to-Left (Persian) or Left-to-Right (Latin).

### Visual Movement & Design Style
A hybrid of **Minimalist Enterprise Architecture** and **Luminescent Surface Stratification**:
- Deep slate and midnight navy ground planes support cool luminescent indigo accents.
- Subtle inner borders, frosted micro-panels, and ambient glow states articulate interactivity.
- Surface divisions rely primarily on subtle value shifts between layered surfaces rather than aggressive divider rules.

## Colors

The palette establishes an authoritative, deep slate foundation punctuated by hyper-focused indigo and violet functional states, with purposeful semantic tiers suited for multi-project telemetry and document states.

### Core Architecture
- **Primary (`#4F46E5`):** Reserved for singular primary actions, focused keyframes, primary telemetry paths, and active navigation indicators.
- **Secondary (`#6366F1`):** Applied to active toggles, hover elevations, secondary data markers, and contextual links.
- **Tertiary (`#06B6D4`):** An electric cyan utilized strictly for API indicators, code artifact badges, and live background sync tasks.
- **Neutral Surface Matrix (`#0F172A` as base canvas):** 
  - `canvas`: `#0A0F1D` (Ground canvas / Base background)
  - `surface-1`: `#0F172A` (Sidebar rails, nested page background)
  - `surface-2`: `#1E293B` (Cards, documentation modules, persistent headers)
  - `surface-3`: `#334155` (Input fills, table hover layers, popovers)
  - `border-subtle`: `#1E293B` (60% alpha or solid `#1E293B` against lower surfaces)
  - `border-strong`: `#334155`

### Enterprise Status Badges (Persian / Bilingual Context)
- **فعال (Active):** Emerald hue (`#10B981` text, background `rgba(16, 185, 129, 0.12)`, border `rgba(16, 185, 129, 0.25)`)
- **در حال توسعه (In Progress / Development):** Amber hue (`#F59E0B` text, background `rgba(245, 158, 11, 0.12)`, border `rgba(245, 158, 11, 0.25)`)
- **آرشیو شده (Archived):** Slate/Muted hue (`#94A3B8` text, background `rgba(148, 163, 184, 0.10)`, border `rgba(148, 163, 184, 0.20)`)
- **File Format Tokens:** Figma (`#F24E1E`), PDF (`#EF4444`), React/TSX (`#38BDF8`), API Spec/OpenAPI (`#10B981`).

## Typography

The typographic hierarchy prioritizes bi-directional clarity and high-density legibility across quantitative metrics, Persian technical prose, code manifests, and project labels.

### Font System & RTL/Persian Implementation
- **Primary Typeface (Latin / Neutral):** `Plus Jakarta Sans` delivers geometric structure with open counters, mimicking the balance of modern Iranian digital typefaces like Vazirmatn.
- **RTL Persian Complement:** Pair with `Vazirmatn` or `IRANSansX` for Persian script fallbacks (`font-family: 'Plus Jakarta Sans', 'Vazirmatn', system-ui, sans-serif`). Persian text uses proportional baseline tracking without artificial italics.
- **Monospace & Metadata Typeface:** `JetBrains Mono` handles version stamps, API endpoints, numeric telemetry counters, and file extension slugs.

### Typographic Rules
- Numerals within Persian interfaces should support standard Persian localized glyphs for dashboard metrics alongside standard ASCII figures for technical specifications.
- Heading weights are capped at `700` to prevent visual clogging in dense multi-column views.
- Mono labels enforce uppercase letter spacing in Latin environments and standard clean spacing in Persian.

## Layout & Spacing

The layout is built upon an asymmetric, highly flexible enterprise grid that adjusts across Left-to-Right and Right-to-Left axis mirroring.

### Grid & Canvas Structure
- **Persistent Global Navigation Rail:** Fixed width of `280px` on desktop (collapsible to `72px` icon rail). Positioned at the **Right** edge in RTL Persian configurations, and the **Left** edge in LTR Latin mode.
- **Primary Workspace Canvas:** Fluid grid bounded to maximum `1680px` with an inner 12-column sub-grid for dashboard telemetry widgets and card matrices.
- **Contextual Inspector / Documentation Drawer:** Optional 360px contextual panel docking opposite the primary navigation rail.

### Breakpoint Matrix
- **Mobile (< 768px):** Navigation transitions to a full-screen slide drawer. Multi-column cards collapse to a single continuous stack. Gaps standardise to `space-md` (`1rem`).
- **Tablet (768px - 1024px):** 12-column grid reflows to 6 columns. Global navigation defaults to the condensed 72px rail.
- **Desktop (1024px+):** Full 12-column arrangement. Complex metric ribbons display 4 cards across (3 columns each); document archives display 3 cards across (4 columns each).

## Elevation & Depth

Visual depth is achieved through layered tonal surfaces and selective ambient luminosity, avoiding heavy artificial dropshadows.

### The Surface Stack
1. **Layer 0 (Canvas Base):** Deep `#0A0F1D`. Provides maximum visual distance and zero reflection.
2. **Layer 1 (Structural Containers):** `#0F172A` with a crisp 1px solid stroke of `rgba(255, 255, 255, 0.05)`.
3. **Layer 2 (Interactive Cards & Modules):** `#1E293B` with micro-top-edge highlights (`border-top: 1px solid rgba(255, 255, 255, 0.08)`).
4. **Layer 3 (Overlays, Modals, Menus):** `#1E293B` backed by `backdrop-filter: blur(16px)` and an ambient shadow: `0 20px 40px -15px rgba(0, 0, 0, 0.6)`.

### Ambient Indigo Glows
Focused components (such as an active project card or focused documentation search input) receive a localized indigo peripheral halo:
`box-shadow: 0 0 0 1px #4F46E5, 0 8px 24px -4px rgba(79, 70, 229, 0.30)`.

## Shapes

The interface balances sharp architectural efficiency with deliberate corner rounding.

- **Standard Base Components (`roundedness: 2` / 0.5rem - 8px):** Buttons, standard text fields, micro status badges, dropdown elements, and tab items.
- **Structural Cards (`rounded-lg` / 1rem - 16px):** Telemetry dashboard widgets, document repository cards, project archive units.
- **Modals & Drawers (`rounded-xl` / 1.5rem - 24px):** Large flyout documentation panels and central modal workflows.
- **Pills / Radiused Dots:** Metric notification indicators and file extension tags use fully rounded pills where the radius equals height / 2.

## Components

### 1. Buttons
- **Primary Action:** Solid `#4F46E5` background, pure white text, 8px radius (`roundedness: 2`). Transitions to `#6366F1` on hover with a `0 4px 12px rgba(79, 70, 229, 0.35)` elevation.
- **Secondary Action:** Translucent `#1E293B` background, subtle border `1px solid rgba(255, 255, 255, 0.1)`, hover fill `#334155`.
- **Tertiary / Ghost:** Borderless, slate-300 text (`#CBD5E1`), background transparent; hover acquires `rgba(255, 255, 255, 0.04)`.
- **Bidirectional Placement:** In RTL view, primary button icons automatically mirror or dock to the right side of the text label.

### 2. Status Badges & Chips
- Formed as tight, legible inline items: height `24px`, padding `0 8px`, `JetBrains Mono` 11px font weight 500.
- Built with a 1px matching border and semi-translucent inner tint (e.g., Active: border `rgba(16, 185, 129, 0.25)`, fill `rgba(16, 185, 129, 0.12)`, text `#10B981`).
- Accompanied by a 6px diameter pulsing dot for real-time states (e.g., active build or live deployment).

### 3. Metric Widgets & KPI Cards
- Base surface `#1E293B` with `rounded-lg` (16px) curvature and subtle `1px solid rgba(255, 255, 255, 0.05)` border.
- Header holds Persian/English metric title (`body-sm`) paired with a categorical icon.
- Central value displayed in high-contrast `headline-lg` (`#F8FAFC`).
- Bottom row features trend badges (e.g., `+12.4%` in green chip) juxtaposed against comparison period strings.

### 4. File Format Indicators & Repository Rows
- Dedicated file icons housed in a 36x36px rounded-md container tinted according to format:
  - **Figma:** Deep violet-orange tint.
  - **PDF:** Translucent crimson tint.
  - **React / TSX:** Translucent sky-blue tint.
  - **API Spec:** Translucent emerald tint.
- Repository rows feature metadata tracking: version number, last editor avatar, update timestamp, and an instant action trigger (Preview, Download, Archive).

### 5. Input Fields & Search Bars
- Background surface `#0F172A`, 1px solid stroke `#334155`, text `#F8FAFC`, placeholder `#64748B`.
- Height standard: `40px` for standard controls, `48px` for primary command-palette search.
- Focus state activates `#4F46E5` stroke alongside a 3px outer glow ring `rgba(79, 70, 229, 0.25)`.
- Quick-filter keyboard shortcuts (`⌘K` / `Ctrl+K`) anchored to the terminal edge in mono labels.

### 6. Sidebar Navigation
- Vertical categorical groups with micro-caps category headers (`label-sm`, `#64748B`).
- Links feature an icon (20px) + bilingual label + optional counter badge.
- Active state renders a vertical indicator pill (3px wide) hugging the inside edge (right edge for RTL Persian, left edge for LTR), with an indigo-tinted surface fill (`rgba(79, 70, 229, 0.12)`).