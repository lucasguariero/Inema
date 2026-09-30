---
name: Institutional Portal
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#404945'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#707975'
  outline-variant: '#bfc9c4'
  surface-tint: '#326859'
  primary: '#002f25'
  on-primary: '#ffffff'
  primary-container: '#0a473a'
  on-primary-container: '#7eb5a4'
  inverse-primary: '#9ad2c0'
  secondary: '#2a6862'
  on-secondary: '#ffffff'
  secondary-container: '#aeebe4'
  on-secondary-container: '#2f6c66'
  tertiary: '#461c13'
  on-tertiary: '#ffffff'
  tertiary-container: '#613127'
  on-tertiary-container: '#dd998b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6eedc'
  primary-fixed-dim: '#9ad2c0'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#175042'
  secondary-fixed: '#b1eee7'
  secondary-fixed-dim: '#95d2cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#09504b'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#fdb5a6'
  on-tertiary-fixed: '#350f08'
  on-tertiary-fixed-variant: '#6b392f'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
  sidebar-active: '#d1e1de'
  text-main: '#111827'
  text-muted: '#6b7280'
  border-subtle: '#e5e7eb'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  header-height: 64px
  container-padding: 2rem
  gutter: 1.5rem
  stack-gap: 1rem
---

## Brand & Style
The design system is built upon a **Corporate / Modern** aesthetic, emphasizing reliability, civic responsibility, and institutional transparency. It utilizes a structured, clean layout that prioritizes ease of navigation for government-related administrative tasks. 

The visual language balances a high-density sidebar with expansive, card-based content areas, using a professional dark green anchor to establish authority. The emotional response should be one of competence and clarity, ensuring users feel guided through complex regulatory processes without unnecessary friction.

## Colors
The palette is dominated by an institutional dark green (#0a473a), used primarily in the header and key brand elements to signify stability. 

- **Primary:** The core green used for headers and primary brand identification.
- **Secondary:** A slightly more saturated teal-green used for buttons and interactive states.
- **Neutral:** A light gray (#f3f4f6) is used for the application background to provide a soft contrast against white cards (#ffffff).
- **Functional:** Dark slate (#111827) is reserved for high-contrast typography, while a medium gray is used for supporting text. Active states in navigation use a desaturated tint of the primary green to highlight the current location without overwhelming the UI.

## Typography
This design system utilizes **Inter** exclusively to achieve a modern, utilitarian feel that ensures high legibility across data-heavy interfaces. 

Hierarchies are established primarily through weight and color rather than drastic size shifts. Section titles are semi-bold to bold, while body content remains at a comfortable 14px or 16px size. Links and labels use medium weights to distinguish them from static text.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. 

- **Sidebar:** A persistent 280px navigation column on the left.
- **Main Canvas:** A fluid area with a 2rem padding from the edges.
- **Grid:** Content within the canvas is organized into a responsive grid. Cards typically span 4 columns in a 12-column desktop grid (3-up layout).
- **Breakpoints:** On tablets, the sidebar may collapse into a drawer. On mobile, the card grid reflows to a single column, and the header persistent search bar is replaced by a search icon.

## Elevation & Depth
The system uses **Tonal Layers** and **Low-contrast outlines** to create depth rather than heavy shadows.

- **Level 0 (Background):** Light grey (#f3f4f6).
- **Level 1 (Cards/Sidebar):** Pure white (#ffffff) with a subtle 1px border (#e5e7eb).
- **Interactive State:** Hovering over a card may trigger a very soft, diffused ambient shadow to indicate clickability.
- **Header:** Elevated via color (Primary Green) rather than shadow, creating a clear horizon line for the application.

## Shapes
A **Rounded** (0.5rem) shape language is applied to standard UI components like cards, input fields, and buttons. 

- **Small elements:** Buttons and input fields use the base 0.5rem (8px) radius.
- **Container elements:** Large cards and the active navigation highlight use a slightly more pronounced rounding (0.75rem or 12px) to soften the institutional nature of the portal.
- **Icons:** Background containers for icons within cards are rounded squares.

## Components

### Sidebar Navigation
The sidebar uses a high-density list. Active items are indicated with a light green background tint (#d1e1de) and a thicker font weight. Parent items with children include a chevron indicator.

### Dashboard Cards
Cards feature a white background with a subtle border. They are structured with a top-aligned icon in a colored container, a bold title, a short description in muted text, and a bottom-aligned text link ("Acessar") followed by a right arrow icon.

### Header
The header is a solid block of Primary Green. It contains the organization logo (left), a centered or right-aligned search bar with a white background and 0.5rem rounding, and utility icons (notifications, profile) on the far right.

### Buttons & Controls
- **Primary Buttons:** Solid secondary green with white text.
- **Input Fields:** White background with a 1px border, utilizing the "Inter" font for placeholder and user text.
- **Chips/Badges:** Notification counts appear as small circles in a contrasting color (e.g., secondary green or a subtle red) positioned at the top-right of the notification icon.

### Search Bar
The search bar within the header is high-contrast (White on Dark Green). It includes a magnifying glass icon and uses a "Soft" roundedness (0.5rem) to match the card style.