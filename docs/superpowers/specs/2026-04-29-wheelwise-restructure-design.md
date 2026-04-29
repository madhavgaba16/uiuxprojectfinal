# WheelWise Restructure & UI Redesign

## Overview

Restructure a flat React CRA + Express/MongoDB driver community platform into clean frontend/backend separation, migrate CRA to Vite, complete UI redesign with professional dashboard style, and clean all code.

## 1. Repository Restructure

### New Structure
```
uiuxprojectfinal/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── AccountPage.js + .css
│       │   ├── ChatListPage.js + .css
│       │   ├── FeedPage.js + .css
│       │   ├── IntroPage.js + .css
│       │   ├── LoginPage.js + .css
│       │   ├── NewsPage.js + .css
│       │   ├── PostPage.js + .css
│       │   └── ServicesPage.js + .css
│       ├── api.js
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── backend/
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── models/ (Driver, Post, Conversation, Message, Wallet, Transaction)
│       ├── routes/ (auth, post, chat, wallet)
│       └── utils/timeAgo.js
├── .gitignore
└── docs/
```

### Files to Delete
- `node_modules/` — remove from git tracking entirely
- `build/`, `static/`, root `index.html`, root `asset-manifest.json` — build artifacts
- `MONGODB_FEATURES_GUIDE.md`, `MONGODB_MASTER_SUMMARY.md`, `MONGODB_QUICK_REFERENCE.md`, `MONGODB_TESTING_GUIDE.md`, `MONGODB_VERIFICATION_REPORT.md`, `README_MONGODB.md`
- `src/components/BottomNav.js` + `BottomNav.css` — unused dead code
- `src/Screenshot 2025-11-30 215225.png`, `src/driver.png` — stray images
- `.vscode/` — editor config
- `backend/src/checkPosts.js`, `backend/src/dbInspect.js`, `backend/src/seed.js` — debug scripts
- Root `package-lock.json`

### Backend package.json Cleanup
- Remove `"driver-community-platform": "file:.."` dependency
- Keep: express, mongoose, cors, dotenv, nodemon

## 2. CRA to Vite Migration

- Replace `react-scripts` with `vite` + `@vitejs/plugin-react`
- Move `public/index.html` to `frontend/index.html` (Vite convention), add `<script type="module" src="/src/index.js">` entry
- Rename env vars: `REACT_APP_API_BASE` → `VITE_API_BASE`
- Update `api.js`: `process.env.REACT_APP_API_BASE` → `import.meta.env.VITE_API_BASE`
- Create `vite.config.js` with React plugin and dev proxy to `http://localhost:5000/api`
- Scripts: `dev`, `build`, `preview`

## 3. UI Redesign

### Design Tokens
- **Palette**: Stone (warm earthy grays)
  - Dark surface: `#1c1917`, `#292524`, `#44403c`
  - Light surface: `#fafaf9`, `#f5f5f4`, `#e7e5e4`
  - Text dark: `#1c1917`
  - Text light: `#fafaf9`
  - Muted: `#78716c`
  - Border light: `#e7e5e4`
  - Border dark: `#44403c`
  - Accent: `#059669` (emerald)
  - Accent hover: `#047857`

### Theme System
- CSS custom properties on `:root` for light mode
- `[data-theme="dark"]` selector overrides for dark mode
- Toggle button in sidebar footer
- Default: light mode
- Persist choice in `localStorage`

### Layout
- Wide sidebar (220px) with text labels + SVG icons
- No emojis anywhere
- Content area fills remaining width
- No right sidebar panel
- Mobile: sidebar collapses to horizontal top nav

### Component Styling
- Rewrite all component CSS from scratch — current CSS has excessive `!important` overrides
- Cards: subtle border, minimal shadow, rounded corners (8px)
- Buttons: solid fill for primary (emerald), outline for secondary
- Inputs: clean border, stone-muted placeholder
- Typography: Inter font, clear hierarchy (headings, body, muted)

## 4. Backend

### Configuration
- MongoDB Atlas SRV: `mongodb+srv://dvashishatbe23_db_user:n7QEM77qVzFIL3Xg@cluster0.3ibwbap.mongodb.net/madhavGaba`
- Port: 5000

### Code Cleanup
- Remove dead debug scripts
- Remove circular file dependency
- Keep seed logic in server.js (creates initial data on empty DB)

## 5. Testing Plan

### Backend API Testing (curl)
1. `GET /api/health` — health check
2. `POST /api/auth/login-register` — register/login driver
3. `GET /api/posts` — list posts
4. `POST /api/posts` — create post
5. `POST /api/posts/:id/vote` — upvote/downvote
6. `POST /api/posts/:id/comments` — add comment
7. `POST /api/chats/start` — start conversation
8. `GET /api/chats?driverId=X` — list conversations
9. `GET /api/chats/:id/messages` — get messages
10. `POST /api/chats/:id/messages` — send message
11. `GET /api/wallet/:id` — get wallet
12. `POST /api/wallet/:id/add` — add funds

### Frontend Testing
- Start Vite dev server
- Verify all pages load
- Test login flow
- Test dark/light mode toggle
- Check mobile responsive behavior
