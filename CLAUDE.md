# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**API WIKI** is a Next.js-based web platform where developers can discover, compare, and share experiences about various APIs. The project is a prototype built with Next.js 14, TypeScript, and Tailwind CSS, featuring a Korean-language interface for API discovery and exploration.

## Development Commands

### Working Directory
All commands should be run from the `api-wiki/` subdirectory:
```bash
cd api-wiki
```

### Essential Commands
```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

### App Router Structure (Next.js 14)
- **File-based routing**: All routes are in `src/app/`
- **Layout**: Shared layout with global fonts (Roboto, Noto Sans KR, Orbitron) in [src/app/layout.tsx](api-wiki/src/app/layout.tsx)
- **Client components**: Most pages use `'use client'` directive for interactivity

### Core Pages
1. **Home** ([src/app/page.tsx](api-wiki/src/app/page.tsx)) - Landing page with search, category carousel, popular APIs, and news
2. **Explore** ([src/app/explore/page.tsx](api-wiki/src/app/explore/page.tsx)) - Search results with filtering, sorting, infinite scroll, and comparison features
3. **API Detail** ([src/app/api/[id]/page.tsx](api-wiki/src/app/api/[id]/page.tsx)) - Dynamic route showing detailed API info with tabs (overview, pricing, reviews, code examples)

### Data Layer
- **Mock Data**: Currently uses mock data from [src/data/mockData.ts](api-wiki/src/data/mockData.ts)
- **Type Definitions**: All interfaces defined in [src/types/index.ts](api-wiki/src/types/index.ts)
- **Helper Functions**: `getAPIById()` and `getRelatedAPIs()` in mockData.ts

### Component Organization
Components are in `src/components/`:
- **SearchBar**: Reusable search input with navigation to `/explore?q={query}`
- **CategoryCarousel**: Horizontal scrolling category selector
- **APICard**: API information card (used in grids and carousels)
- **APICarousel**: Horizontal scrolling API cards with navigation buttons
- **NewsCard**: News/community post card
- **Header** & **Footer**: Layout components (Footer exists but not currently used)

### Styling System
- **Tailwind CSS**: Utility-first styling
- **Custom animations**: Defined in [src/app/globals.css](api-wiki/src/app/globals.css)
  - `gradient-animation`: 6s animated gradient for logo
  - `fadeInUp`: Fade in with upward slide
  - `fadeIn`: Simple fade in
  - `slideInRight`: Slide in from right
- **CSS Variables**: Colors and theme values in `:root`
- **Custom utilities**: `.scrollbar-hide`, `.line-clamp-2`, `.line-clamp-3`
- **Orbitron font**: Used exclusively for "API WIKI" logo with gradient effect

### State Management Patterns
- **URL state**: Search queries via `useSearchParams()` and `router.push()`
- **Local state**: React hooks for filters, sorting, pagination
- **Suspense**: Used in explore page for loading states with `useSearchParams`

### Key Implementation Details

#### Search Flow
1. User enters query in SearchBar component
2. Router navigates to `/explore?q={query}`
3. Explore page reads query param and filters mock data
4. Results displayed with filtering/sorting options

#### Filtering & Sorting (Explore Page)
- **Filters**: Price (free/paid/mixed), Rating (2+/3+/4+ stars), Country, Auth method, Documentation language, Company
- **Sorting**: Popular (rating), Latest, Most reviews (users count), Lowest cost
- **Infinite scroll**: Uses Intersection Observer API with 12 items per page

#### Comparison Feature
- Users can select up to 4 APIs to compare
- Selection state stored in local component state
- Compare button enabled when 2+ APIs selected

#### Dynamic Routing
- API detail pages use `[id]` folder pattern
- ID extracted via `useParams()` hook
- Mock data fetched with `getAPIById(id)` helper

## Technical Constraints

### Environment Variables
- **NEXT_PUBLIC_KAKAO_KEY**: Kakao Maps SDK key (loaded in layout.tsx, currently optional)

### TypeScript Configuration
- Path alias `@/*` maps to `./src/*`
- Target: ES2017
- Strict mode enabled

### Known Patterns
- All client components must include `'use client'` directive at top
- Suspense boundaries required when using `useSearchParams`
- Links use Next.js `<Link>` component or standard `<a>` tags

## File Naming Conventions
- `*_old.tsx` files are legacy versions kept for reference (e.g., `page_old.tsx`, `APICard_old.tsx`)
- Main implementations have no suffix

## Mock Data Structure
8 sample APIs with complete information:
- YouTube API (Google)
- OpenStreetMap
- Google Login
- OpenAI GPT-5
- Naver Map API
- Kakao Map API
- Toss Payments
- AWS S3

9 categories: 결제, 소셜로그인, 지도, 날씨, AI, 이메일, 금융, 데이터, 보안

## Future Backend Integration Notes
The codebase is structured for easy backend integration:
- Replace mock data imports with API calls
- Type definitions already match expected data structure
- Helper functions can be converted to API endpoints
- Consider Next.js API routes for backend (`api-wiki/src/app/api/`)
