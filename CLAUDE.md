# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YAUSMA (Yet Another Useful Stock Market App) is a multi-platform stock market application with three main components:

- **Backend**: Rust-based API server using Rocket framework with OpenAPI specification
- **Web**: Vanilla JavaScript frontend with Bootstrap UI components
- **Mobile**: Flutter application for iOS/Android

## Build System

The project uses `just` as the task runner. Key commands:

### Backend (Rust)
```bash
cd backend
cargo build          # Build the backend
cargo run            # Run the backend server
cargo test           # Run tests
```

### Web (JavaScript)
```bash
cd web
npm install          # Install dependencies
npm start            # Start development server on port 8080
```

### Mobile (Flutter)
```bash
cd mobile
flutter pub get      # Install dependencies
flutter run          # Run on connected device/emulator
flutter test         # Run tests
```

## Architecture

### API Design
- OpenAPI 3.0 specification in `openapi.yaml`
- Backend generates API documentation from Rust code using `rocket_okapi`
- Mobile app uses generated API client from OpenAPI spec (in `mobile/gen_api/`)

### Backend Structure
- Main entry point: `backend/src/main.rs`
- API implementation: `backend/api/src/lib.rs`
- Uses Rocket framework with OpenAPI integration
- Planned database: Sled (embedded database)
- Authentication uses SHA-hashed credentials

### Web Frontend
- Vanilla JavaScript with ES6 classes
- Bootstrap 5 for UI components
- Chart.js for data visualization
- Configuration centralized in `web/js/config.js`
- Theme system with light/dark modes
- Local storage for user preferences and caching

### Key Web Components
- `web/js/main.js`: Main application initialization
- `web/js/api/`: API client modules
- `web/js/components/`: Reusable UI components
- `web/js/pages/`: Page-specific JavaScript
- `web/css/themes/`: Theme stylesheets

### Mobile App
- Flutter 3.1.4+
- Uses generated OpenAPI client
- Located in `mobile/lib/main.dart`

## Development Environment

The project uses devenv (Nix) for development environment management. The configuration allows unfree packages and uses the devenv-nixpkgs rolling release.

## API Integration

- Backend serves on `http://localhost:8000` (development)
- Web frontend configured to consume backend API
- External APIs: Marketstack for stock data, NewsAPI for financial news
- API keys should be set via environment variables

## Testing

- Backend: Use `cargo test`
- Mobile: Use `flutter test`
- Web: No test framework currently configured

## Key Files to Understand

- `openapi.yaml`: API specification
- `web/js/config.js`: Frontend configuration
- `backend/api/src/lib.rs`: Backend API implementation
- `mobile/pubspec.yaml`: Flutter dependencies

# CLAUDE.md - Frontend Development Instructions

## Role & Context
You are a senior frontend engineer tasked with creating a modern, responsive stock market web application called **YAUSMA** (Your Advanced User Stock Market Analysis). This is a complete redesign focusing on UI/UX excellence and responsive design patterns, **inspired by Coinbase's sophisticated financial design system**.

## Technical Requirements

### Technology Stack (MANDATORY)
- **HTML5/PHP** (with semantic elements and dynamic content)
- **CSS3** (modern features, flexbox, grid)
- **Bootstrap 5** (latest version)
- **JavaScript** (ES6+, but DESIGN-FOCUSED only)
- **Responsive Design** (mobile-first approach)
- **Chart.js** (for data visualization containers)

### Backend Architecture
- **Backend**: Rust-based proxy server
- **API Strategy**: Rust backend acts as proxy to external stock APIs (like Marketstack)
- **Data Flow**: Client → Rust Backend → External Stock APIs → Rust Backend → Client
- **Integration**: OpenAPI specification for API communication
- **Current Focus**: Frontend structure and design only (API integration later)

## Design Resources & Freedom

### Logo Creation
- **Recommended**: https://www.freelogodesign.org/
- Create a professional logo for YAUSMA (inspired by Coinbase's clean, geometric approach)
- Ensure logo works in both light and dark themes
- Use consistent branding across all pages

### Template Reference (Optional)
- **Available Templates**: https://html5up.net/
- You may reference templates for inspiration
- **MUST customize extensively** to match Coinbase-inspired requirements
- Understand template structure for modifications

### Visual Assets
- **Icons**: https://www.flaticon.com/ (free icons)
- **Images**: https://pixabay.com/ (free stock images)
- **Alternative**: Bootstrap Icons or Font Awesome
- Use realistic financial/trading imagery
- Ensure all assets are high-quality and professional

## File Structure Constraints
- **DO NOT create additional files** unless absolutely critical
- Each page MUST have: `.html`, `.css`, `.js` files
- Use existing file structure only
- Modify only provided empty files

## Coinbase-Inspired Design System

### Color Palette (COINBASE-INSPIRED - MANDATORY)
```css
/* Primary Coinbase-inspired colors */
:root {
  /* Brand Colors */
  --primary-blue: #011082;        /* Coinbase dark navy - primary brand */
  --interactive-blue: #344afb;    /* Coinbase bright blue - CTAs */
  --secondary-blue: #1652f0;      /* Medium blue for gradients */
  
  /* Financial Data Colors */
  --success-green: #00d395;       /* Coinbase green for gains */
  --error-red: #f92364;           /* Coinbase red for losses */
  --warning-yellow: #ffc947;      /* Coinbase yellow for alerts */
  
  /* Neutral Palette */
  --text-primary: #050f19;        /* Coinbase primary text */
  --text-secondary: #5b616e;      /* Coinbase secondary text */
  --text-tertiary: #8a919e;       /* Coinbase tertiary text */
  --border-light: #d8dce0;        /* Coinbase light borders */
  --background-light: #ffffff;    /* Light background */
  --background-secondary: #f7f8fa; /* Secondary light background */
  
  /* Dark Theme */
  --dark-bg-primary: #0c0e16;     /* Coinbase dark primary */
  --dark-bg-secondary: #1a1d29;   /* Coinbase dark secondary */
  --dark-text-primary: #ffffff;   /* Dark theme primary text */
  --dark-text-secondary: #9ca0a6; /* Dark theme secondary text */
  --dark-border: #2d3139;         /* Dark theme borders */
}
```

### Typography System (COINBASE-INSPIRED)
```css
/* Coinbase-inspired typography scale */
:root {
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  
  /* Font sizes - systematic scale */
  --font-size-xs: 12px;   /* Small UI elements */
  --font-size-sm: 14px;   /* UI components */
  --font-size-base: 16px; /* Body text */
  --font-size-lg: 18px;   /* Large body text */
  --font-size-xl: 20px;   /* Subheadings */
  --font-size-2xl: 24px;  /* Section headings */
  --font-size-3xl: 32px;  /* Page headings */
  --font-size-4xl: 40px;  /* Display headings */
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Line heights */
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}

/* Typography classes */
.display-heading {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.section-heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-base);
}

.ui-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-base);
}

.financial-data {
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.02em;
}
```

### Coinbase-Style Components

#### Buttons (COINBASE-INSPIRED)
```css
/* Primary button - Coinbase gradient style */
.btn-coinbase-primary {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--interactive-blue) 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(52, 74, 251, 0.2);
  cursor: pointer;
}

.btn-coinbase-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 74, 251, 0.3);
}

/* Secondary button */
.btn-coinbase-secondary {
  background: transparent;
  border: 2px solid var(--interactive-blue);
  color: var(--interactive-blue);
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease-in-out;
}

.btn-coinbase-secondary:hover {
  background: var(--interactive-blue);
  color: white;
}
```

#### Form Elements (COINBASE-INSPIRED)
```css
.form-coinbase {
  background: var(--background-light);
  border: 2px solid var(--border-light);
  border-radius: 8px;
  padding: 14px 16px;
  font-size: var(--font-size-base);
  transition: all 0.2s ease-in-out;
  width: 100%;
}

.form-coinbase:focus {
  outline: none;
  border-color: var(--interactive-blue);
  box-shadow: 0 0 0 3px rgba(52, 74, 251, 0.1);
}

.form-coinbase::placeholder {
  color: var(--text-tertiary);
}
```

#### Cards (COINBASE-INSPIRED)
```css
.card-coinbase {
  background: var(--background-light);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
}

.card-coinbase:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-coinbase-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}
```

### Spacing System (COINBASE 8PX GRID)
```css
:root {
  /* Coinbase 8px grid system */
  --space-xs: 4px;    /* Micro spacing */
  --space-sm: 8px;    /* Small spacing */
  --space-md: 16px;   /* Medium spacing */
  --space-lg: 24px;   /* Large spacing */
  --space-xl: 32px;   /* Extra large spacing */
  --space-2xl: 48px;  /* Section spacing */
  --space-3xl: 64px;  /* Major section spacing */
  --space-4xl: 96px;  /* Hero spacing */
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1200px;
}
```

### Theme Implementation (COINBASE-STYLE)
- **MUST implement both Light & Dark themes** (following Coinbase's approach)
- Theme switcher with smooth transitions
- Consistent theme persistence across entire application
- Use CSS custom properties for theme switching
- Dark theme uses Coinbase's dark color palette

### Responsive Design (COINBASE BREAKPOINTS)
```css
/* Coinbase-inspired breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1200px;
}
```

## Page Requirements

### Required Pages:
1. **index.html** - Landing/Home page (Coinbase-style hero section)
2. **news.html** - News and stock prices overview
3. **stock-detail.html** - Detailed company stock page
4. **auth.html** - Registration/Sign-in (Coinbase-style forms)
5. **portfolio.html** - User portfolio tracking
6. **pro.html** - Pro version upgrade page

### Page Components (Coinbase-Inspired):
- Navigation bar (Coinbase-style sticky nav)
- Hero section with gradient backgrounds
- Main content area with card-based layouts
- Footer with systematic spacing
- Theme toggle button (smooth transitions)
- Responsive mobile menu

## Design Patterns & Components

### Navigation (COINBASE-STYLE)
- Fixed/sticky navbar with backdrop blur
- Logo on the left (Coinbase positioning)
- Menu items in center
- User actions on right
- Mobile hamburger menu with smooth animations

### Stock Data Display (FINANCIAL UI)
- Cards for stock information (Coinbase card style)
- Color-coded price changes: `--success-green` for gains, `--error-red` for losses
- Chart.js containers with Coinbase styling
- Tables with monospace fonts for financial data
- Real-time update indicators (visual only)
- Currency selector interface

### Charts & Data Visualization
- **Chart.js Integration**: https://www.chartjs.org/docs/latest/
- Coinbase-style chart containers with rounded corners
- Color scheme matching Coinbase financial colors
- Time range selectors styled as Coinbase buttons
- Interactive chart legends with hover states

## JavaScript Scope (IMPORTANT)
**DESIGN-FOCUSED ONLY - NO FUNCTIONAL IMPLEMENTATION**

### What TO implement:
- Coinbase-style theme switching (smooth transitions)
- Mobile menu toggle with animations
- Micro-interactions and hover effects
- Bootstrap component initialization
- Modal/dropdown interactions (Coinbase-style)
- Form validation UI (visual feedback only)
- User location detection (UI preparation)

### What NOT to implement:
- API calls or data fetching
- Complex business logic
- Real data processing
- Authentication logic
- Payment processing
- Database interactions

## Specific Features to Design

### Stock Market Elements (COINBASE-INSPIRED)
- Price ticker displays with monospace fonts
- Stock cards with Coinbase card styling
- Chart containers with Coinbase color scheme
- Market indices overview (card-based layout)
- Currency selector (Coinbase dropdown style)
- Time range buttons (Coinbase button group style)
- Search functionality with Coinbase input styling

### User Interface Elements
- Search bars (Coinbase input style)
- Filter buttons and dropdowns
- Pagination components
- Loading spinners (Coinbase-style)
- Success/error message displays
- Modal dialogs with backdrop blur

### Professional Features
- Dashboard-style layouts (Coinbase grid system)
- Data visualization containers
- News article cards (Coinbase card style)
- Portfolio summary cards
- Pro feature comparison tables
- Pricing cards with gradient accents

## Advanced Features (Coinbase-Inspired)

### Core Advanced Features:
- **Light and Dark Mode** (Coinbase-style theme switching)
- **User Watchlist Interface** (Coinbase list design)
- **Shopping Cart Interface** (Coinbase checkout style)
- **Admin Interface Design** (Coinbase dashboard style)

### Coinbase UX Enhancements:
- Smooth page transitions
- Micro-interactions on hover/click
- Progressive loading states
- Contextual tooltips
- Breadcrumb navigation
- Advanced filtering interfaces

## Code Quality Standards (COINBASE-LEVEL)
- Semantic HTML5 elements
- WCAG 2.1 AA accessibility compliance
- Clean, commented CSS with design tokens
- Organized JavaScript (minimal but polished)
- Consistent naming conventions
- Mobile-first CSS approach
- Cross-browser compatibility

## Visual Design Guidelines (COINBASE-INSPIRED)

### Overall Aesthetic:
- Clean, minimal, trustworthy appearance
- Coinbase-level polish and attention to detail
- Financial credibility through color and typography
- Modern web standards with classic financial elements
- Sophisticated color usage (blues for trust, green/red for data)

### Specific Design Elements:
- Gradient buttons and accent elements
- Card-based information architecture
- Monospace fonts for all financial data
- Systematic spacing using 8px grid
- Rounded corners (8px-12px border radius)
- Subtle shadows and depth
- Professional color-coding for market data

## Integration Preparation

### API Integration Ready:
- Design data containers for Marketstack API responses
- Create placeholders styled with Coinbase aesthetics
- Structure components for easy backend integration
- Plan for location-based market customization

### Chart.js Preparation:
- Coinbase-inspired chart styling
- Responsive chart layouts with proper spacing
- Chart control interfaces matching design system
- Color scheme optimized for financial data

## Deliverables
Create a complete, responsive, theme-enabled stock market web application that **matches Coinbase's level of design sophistication**, ready for Rust backend integration. The interface should feel as polished and trustworthy as Coinbase while being optimized for stock market data.

## Success Criteria
- **Coinbase-level visual polish and attention to detail**
- All pages render perfectly on mobile and desktop
- Theme switching works flawlessly with smooth transitions
- Professional appearance that builds immediate trust
- Clean, maintainable code using design system tokens
- Ready for Rust backend API integration
- Accessible and user-friendly interface
- Financial data displayed with appropriate visual hierarchy
- Color-coding that follows financial industry standards

Remember: You're building a **Coinbase-quality** stock market application. Every detail matters - from the exact shade of blue used for CTAs to the precise spacing between elements. The design should inspire the same level of trust and sophistication that users expect from Coinbase, adapted for stock market functionality.
MAIN RESPONSIBILITY IS FRONTEND , DO NOT CHANGE ANYTHING OUTSIDE WEB (ONLY EXTREME CASES(WHEN I SAY))