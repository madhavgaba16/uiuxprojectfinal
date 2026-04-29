# WheelWise Restructure & UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure flat React CRA + Express/MongoDB app into clean frontend/backend separation, migrate to Vite, redesign UI with Stone palette + emerald accent in a professional dashboard style, and verify everything works.

**Architecture:** Two independent packages — `frontend/` (React + Vite) and `backend/` (Express + MongoDB Atlas). Frontend proxies API calls to backend during development. UI uses CSS custom properties for light/dark theming with a wide sidebar layout. No emojis anywhere in UI — SVG icons only.

**Tech Stack:** React 18, Vite, Express 4, Mongoose 8, MongoDB Atlas, CSS custom properties (no Tailwind/UI library)

**Design spec:** `docs/superpowers/specs/2026-04-29-wheelwise-restructure-design.md`

---

## File Structure

```
uiuxprojectfinal/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── index.css         (theme variables)
│       ├── App.js            (shell: sidebar + routes)
│       ├── App.css           (layout + shared classes)
│       ├── api.js            (API client)
│       └── components/       (8 pages, each .js + .css)
├── backend/
│   ├── package.json
│   ├── .env / .env.example
│   └── src/                  (server, models, routes, utils)
├── .gitignore
└── docs/
```

---

### Task 1: Delete junk files and remove node_modules from git

**Files:**
- Delete from git: `node_modules/`, `build/`, `static/`, root `index.html`, `asset-manifest.json`, `package-lock.json`
- Delete from git: `MONGODB_*.md`, `README_MONGODB.md` (6 docs)
- Delete from git: `src/components/BottomNav.js`, `src/components/BottomNav.css`
- Delete from git: `src/Screenshot 2025-11-30 215225.png`, `src/driver.png`
- Delete from git: `.vscode/`
- Delete from git: `backend/src/checkPosts.js`, `backend/src/dbInspect.js`, `backend/src/seed.js`

- [ ] **Step 1: Remove node_modules from git tracking**

```bash
git rm -r --cached node_modules/
```

- [ ] **Step 2: Delete build artifacts from git**

```bash
git rm -r --cached build/ static/
git rm --cached index.html asset-manifest.json package-lock.json
```

- [ ] **Step 3: Delete MongoDB documentation files**

```bash
git rm --cached MONGODB_FEATURES_GUIDE.md MONGODB_MASTER_SUMMARY.md MONGODB_QUICK_REFERENCE.md MONGODB_TESTING_GUIDE.md MONGODB_VERIFICATION_REPORT.md README_MONGODB.md
```

- [ ] **Step 4: Delete dead code and stray files**

```bash
git rm --cached src/components/BottomNav.js src/components/BottomNav.css
git rm --cached "src/Screenshot 2025-11-30 215225.png" src/driver.png
git rm -r --cached .vscode/
git rm --cached backend/src/checkPosts.js backend/src/dbInspect.js backend/src/seed.js
```

- [ ] **Step 5: Delete files from disk**

```bash
rm -rf node_modules/ build/ static/ .vscode/
rm -f index.html asset-manifest.json package-lock.json
rm -f MONGODB_FEATURES_GUIDE.md MONGODB_MASTER_SUMMARY.md MONGODB_QUICK_REFERENCE.md MONGODB_TESTING_GUIDE.md MONGODB_VERIFICATION_REPORT.md README_MONGODB.md
rm -f src/components/BottomNav.js src/components/BottomNav.css
rm -f "src/Screenshot 2025-11-30 215225.png" src/driver.png
rm -f backend/src/checkPosts.js backend/src/dbInspect.js backend/src/seed.js
```

- [ ] **Step 6: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove node_modules, build artifacts, dead code, and junk files from repo"
```

---

### Task 2: Create .gitignore and restructure into frontend/backend

**Files:**
- Create: `.gitignore` (overwrite existing)
- Move: `src/` → `frontend/src/`, `public/` → `frontend/public/`
- Delete: root `package.json`

- [ ] **Step 1: Write comprehensive .gitignore**

```gitignore
node_modules/
dist/
build/
static/
.env
.env.local
.env.*.local
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
Thumbs.db
*.log
npm-debug.log*
.cache/
.superpowers/
.code-review-graph/
/package-lock.json
```

- [ ] **Step 2: Create frontend directory and move source files**

```bash
mkdir -p frontend
mv src/ frontend/src/
mv public/ frontend/public/
rm -f package.json
```

- [ ] **Step 3: Commit restructure**

```bash
git add -A
git commit -m "refactor: restructure repo into frontend/ and backend/ folders"
```

---

### Task 3: Vite migration — create frontend package and config

**Files:**
- Create: `frontend/package.json`, `frontend/vite.config.js`, `frontend/index.html`
- Modify: `frontend/src/api.js` (env var prefix)
- Delete: `frontend/public/index.html`

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "wheelwise-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.3.3"
  }
}
```

- [ ] **Step 2: Create frontend/vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

- [ ] **Step 3: Create frontend/index.html (Vite entry)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>W</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#fafaf9" />
    <meta name="description" content="WheelWise - Driver Community Platform" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <title>WheelWise - Patiala</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Delete old public/index.html, update api.js**

Delete `frontend/public/index.html`. Update `frontend/src/api.js` line 1:

From: `const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';`
To: `const API_BASE = import.meta.env.VITE_API_BASE || '/api';`

- [ ] **Step 5: Install frontend dependencies and smoke test**

```bash
cd frontend && npm install
npx vite --host 127.0.0.1 &
sleep 3
curl -s http://127.0.0.1:3000/ | head -5
kill %1 2>/dev/null
```

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/vite.config.js frontend/index.html frontend/src/api.js
git commit -m "feat: migrate frontend from CRA to Vite"
```

---

### Task 4: Backend cleanup — Atlas SRV, remove dead dep

**Files:**
- Modify: `backend/package.json` (remove `driver-community-platform` dep)
- Create: `backend/.env`, update `backend/.env.example`

- [ ] **Step 1: Fix backend/package.json**

Remove `"driver-community-platform": "file:.."` from dependencies.

- [ ] **Step 2: Create backend/.env**

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/madhavGaba
```

- [ ] **Step 3: Update backend/.env.example**

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

- [ ] **Step 4: Install backend deps**

```bash
cd backend && npm install
```

- [ ] **Step 5: Commit (do NOT commit .env)**

```bash
git add backend/package.json backend/.env.example
git commit -m "fix: clean backend deps, update env config for Atlas"
```

---

### Task 5: Theme system — index.css with CSS variables

**Files:** Rewrite `frontend/src/index.css`

- [ ] **Step 1: Write index.css**

Full CSS reset + `:root` light mode variables + `[data-theme="dark"]` overrides. Stone palette: surfaces `#fafaf9`/`#1c1917`, accent `#059669`, borders `#e7e5e4`/`#44403c`, text `#1c1917`/`#fafaf9`, muted `#78716c`. Include scrollbar styles, global typography.

- [ ] **Step 2: Commit**

---

### Task 6: App shell — sidebar, SVG icons, theme toggle

**Files:** Rewrite `frontend/src/App.js` + `frontend/src/App.css`

- [ ] **Step 1: Write App.js**

New shell with: sidebar (220px wide, fixed), SVG icon components for each nav item (Home, New Post, News, Services, Messages, Profile), NavLink routing, theme toggle button in sidebar footer (sun/moon SVG icons), localStorage theme persistence, `data-theme` attribute on `<html>`.

- [ ] **Step 2: Write App.css**

Sidebar layout, nav items, theme toggle, shared utility classes (`.page-container`, `.page-header`, `.page-title`, `.card`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input-field`, `.form-label`, `.badge`, `.modal-overlay`, `.modal-content`, `.avatar-circle`). Mobile responsive: sidebar becomes horizontal top nav at 768px.

- [ ] **Step 3: Commit**

---

### Task 7: Rewrite IntroPage

**Files:** Rewrite `frontend/src/components/IntroPage.js` + `.css`

- [ ] **Step 1: Write IntroPage.js**

Remove driver.png import (deleted). Remove all emojis. Remove marquee elements. Clean hero section with "WheelWise" title, tagline, description, CTA button. Feature grid with text-only cards. Simple footer.

- [ ] **Step 2: Write IntroPage.css**

Hero centered layout, feature grid, footer sections. All using CSS variables.

- [ ] **Step 3: Commit**

---

### Task 8: Rewrite LoginPage

**Files:** Rewrite `frontend/src/components/LoginPage.js` + `.css`

- [ ] **Step 1: Write LoginPage.js**

Remove all emojis. Remove commented-out header block (old lines 74-83). Clean form with shared classes. Keep all logic.

- [ ] **Step 2: Write LoginPage.css**

Centered form layout. File upload boxes. Responsive form rows.

- [ ] **Step 3: Commit**

---

### Task 9: Rewrite FeedPage

**Files:** Rewrite `frontend/src/components/FeedPage.js` + `.css`

- [ ] **Step 1: Write FeedPage.js**

Remove all emojis. Remove hidden feed-sidebar. Use `.avatar-circle` with first letter of name. Use `.badge` for categories. Keep all existing logic (loadPosts, votes, comments, acceptRide).

- [ ] **Step 2: Write FeedPage.css**

Post cards, vote buttons, comment section. Minimal page-specific CSS.

- [ ] **Step 3: Commit**

---

### Task 10: Rewrite PostPage

**Files:** Rewrite `frontend/src/components/PostPage.js` + `.css`

- [ ] **Step 1: Write PostPage.js**

Remove all emojis from type selector, form labels, preview. Keep logic.

- [ ] **Step 2: Write PostPage.css**

Type selector, form sections, preview card.

- [ ] **Step 3: Commit**

---

### Task 11: Rewrite NewsPage

**Files:** Rewrite `frontend/src/components/NewsPage.js` + `.css`

- [ ] **Step 1: Write NewsPage.js**

Remove all emojis from badges, categories, alert cards. Keep all data and filter logic.

- [ ] **Step 2: Write NewsPage.css**

Tab bar, news card grid, alert cards, category cards.

- [ ] **Step 3: Commit**

---

### Task 12: Rewrite ServicesPage

**Files:** Rewrite `frontend/src/components/ServicesPage.js` + `.css`

- [ ] **Step 1: Write ServicesPage.js**

Remove all emojis from categories and services. Remove hidden example structure (old lines 279-314). Use text for status badges.

- [ ] **Step 2: Write ServicesPage.css**

Category grid, service list, filter buttons.

- [ ] **Step 3: Commit**

---

### Task 13: Rewrite ChatListPage

**Files:** Rewrite `frontend/src/components/ChatListPage.js` + `.css`

- [ ] **Step 1: Write ChatListPage.js**

Remove all emojis. Use `.avatar-circle` for chat avatars. Keep search and navigation logic.

- [ ] **Step 2: Write ChatListPage.css**

Chat list items, search bar.

- [ ] **Step 3: Commit**

---

### Task 14: Rewrite AccountPage (largest component)

**Files:** Rewrite `frontend/src/components/AccountPage.js` + `.css`

- [ ] **Step 1: Write AccountPage.js**

This is 831 lines. Key changes:
- Remove ALL emojis
- **Fix XSS:** Replace `<div className="message-content" dangerouslySetInnerHTML=.../>` with `<p className="message-content">{msg.content}</p>`
- **Fix JSX bug:** Remove `style="color :black;"` (string instead of object)
- **Fix broken audio:** Remove `window.webkitAudioContext()` SOS code — simplify to flash overlay + alert
- Use CSS variables for SOS flash instead of inline styles
- Use shared modal classes for Add Money / Withdraw / Rating modals
- Use `.avatar-circle` pattern

- [ ] **Step 2: Write AccountPage.css**

Profile card, wallet section, chat interface, SOS section, modals. Largest CSS file.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: rewrite AccountPage - fix XSS, fix audio bug, remove emojis"
```

---

### Task 15: Start backend, test all APIs with curl

**Files:** None (testing only)

- [ ] **Step 1: Start backend**

```bash
cd backend && node src/server.js &
sleep 3
```

- [ ] **Step 2: Test health**

```bash
curl -s http://localhost:5000/api/health
```

Expected: `{"ok":true}`

- [ ] **Step 3: Test auth register**

```bash
curl -s -X POST http://localhost:5000/api/auth/login-register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Driver","phone":"9876543210","licenseNumber":"DL-PB11-123456","vehicleNumber":"PB11-AB-1234","carModel":"Swift Dzire"}'
```

Save returned `_id` for subsequent tests.

- [ ] **Step 4: Test posts list**

```bash
curl -s http://localhost:5000/api/posts
```

- [ ] **Step 5: Test post create**

```bash
curl -s -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"driverId":"<ID>","category":"ride","title":"Test Ride","description":"Going to Chandigarh","pickupPoint":"Bus Stand","dropPoint":"Sector 17"}'
```

- [ ] **Step 6: Test wallet get + add**

```bash
curl -s http://localhost:5000/api/wallet/<ID>
curl -s -X POST http://localhost:5000/api/wallet/<ID>/add -H "Content-Type: application/json" -d '{"amount":500}'
```

- [ ] **Step 7: Stop backend, fix issues if any**

---

### Task 16: Start frontend, verify in browser

- [ ] **Step 1: Start backend + frontend**

```bash
cd backend && node src/server.js &
cd frontend && npx vite --host 127.0.0.1
```

- [ ] **Step 2: Verify in browser at http://localhost:3000**

Check: intro page, login, dashboard sidebar, all 6 pages, dark/light toggle, no emojis visible.

- [ ] **Step 3: Fix any issues found**

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
