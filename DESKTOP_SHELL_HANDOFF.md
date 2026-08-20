# Desktop Shell Handoff Guide

Use this document to rebuild the **Precinct Command** desktop-style UI shell in another project. The shell is a React SPA that mimics a Windows-like workstation: draggable desktop icons, floating windows with chrome, taskbar, start menu, snap-to-edge, and z-index focus management.

This guide is written for a Cursor agent (or human) starting from a blank repo. Copy the shell files listed below, swap game-specific branding for your own theme, and register your own apps.

---

## Quick Start Prompt (paste into a new Cursor chat)

```
Build a desktop-style game shell using the architecture in DESKTOP_SHELL_HANDOFF.md.

Requirements:
- React + TypeScript + Vite + Tailwind CSS v4
- Window manager context with open/close/minimize/maximize/snap
- Desktop icon grid, taskbar, start menu, window frames
- App registry pattern — start with one blank placeholder app
- No game logic yet — just the empty shell

Follow the file structure, types, and patterns exactly as documented.
Use lucide-react for icons.
```

---

## What This Shell Is

| Layer | Responsibility |
|-------|----------------|
| **Entry** | `main.tsx` → `App.tsx` → providers → `Desktop` |
| **State** | `WindowManagerContext` owns all windows, focus, z-order, snap preview |
| **Registry** | `apps.config.ts` maps app IDs → metadata + React component |
| **Shell UI** | Desktop wallpaper, icons, windows, taskbar, start menu, snap overlay |
| **Apps** | Self-contained React components mounted inside `WindowFrame` |

The shell is **not** tied to Electron or a backend. It runs in the browser. Optional PWA and Electron wrappers exist but do not implement native OS windows — all chrome is in-browser.

---

## Architecture Diagram

```
main.tsx
  └── App.tsx
        ├── AIProvider (optional — remove for blank shell)
        └── WindowManagerProvider
              └── DesktopBootloader (optional default openWindow call)
                    └── Desktop.tsx
                          ├── DesktopIconGrid  → openWindow(appId)
                          ├── WindowFrame × N  → mounts appDef.component
                          ├── SnapOverlay      → snap preview during drag
                          └── Taskbar
                                ├── StartMenu  → openWindow(appId)
                                └── SystemTray → status badges, clock
```

**Data flow:** Any UI surface calls `openWindow('appId')` → context creates/focuses a `WindowInstance` → `Desktop` maps `windows[]` to `<WindowFrame>` → `WindowFrame` renders `<AppComponent windowId appId />`.

---

## Shell File Inventory

Copy these files to rebuild the desktop. Paths are relative to repo root.

### Core (required)

| File | Purpose |
|------|---------|
| `src/main.tsx` | React mount, global CSS import, optional PWA service worker |
| `src/App.tsx` | Provider tree, renders `<Desktop />` |
| `src/index.css` | Tailwind import, wallpaper, window shadows, scrollbars |
| `src/types/index.ts` | `WindowInstance`, `AppDefinition`, `SnapTarget`, etc. |
| `src/context/WindowManagerContext.tsx` | Window state machine — **copy nearly verbatim** |
| `src/config/apps.config.ts` | App registry (`APP_REGISTRY`, `APP_LIST`, `getAppById`) |
| `src/components/desktop/Desktop.tsx` | Root layout, layer stacking |
| `src/components/desktop/DesktopIconGrid.tsx` | Draggable desktop shortcuts |
| `src/components/window/WindowFrame.tsx` | Title bar, drag, resize, snap, app mount |
| `src/components/window/SnapOverlay.tsx` | Visual snap zone preview |
| `src/components/taskbar/Taskbar.tsx` | Bottom dock, window tabs, start button |
| `src/components/taskbar/StartMenu.tsx` | Searchable app launcher |
| `src/components/taskbar/SystemTray.tsx` | Status area + clock (customize contents) |
| `src/components/common/AppIconRenderer.tsx` | String icon name → Lucide icon |
| `src/hooks/useIsMobile.ts` | `< 640px` breakpoint hook |

### Build config (required)

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + `@tailwindcss/vite` + optional PWA |
| `index.html` | Root div, fonts, PWA meta |
| `package.json` | See dependencies below |
| `tsconfig.json` / `tsconfig.app.json` | TypeScript project refs |

### Optional

| File | Purpose |
|------|---------|
| `src/hooks/usePWAInstall.ts` | PWA install button in Start Menu |
| `src/components/common/UpdateNotifier.tsx` | Electron auto-update toast |
| `src/types/electron.d.ts` | Electron preload types |
| `electron/main.cjs` | Electron wrapper |
| `electron/preload.cjs` | IPC bridge |

### Game-specific (do NOT copy for blank shell)

| Path | Why skip |
|------|----------|
| `src/components/apps/*` | Game apps — write your own |
| `src/context/AIContext.tsx` | Gemini integration — optional |
| `src/domain/*` | Game data models |
| `server/*` | Backend for saves — unrelated to shell |

---

## Dependencies

Minimum for the shell:

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.x",
    "lucide-react": "^1.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "tailwindcss": "^4.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "@vitejs/plugin-react": "^6.x",
    "typescript": "^6.x",
    "vite": "^8.x"
  }
}
```

Optional: `vite-plugin-pwa` for installable PWA, `electron` for desktop packaging.

---

## Core Types (`src/types/index.ts`)

```ts
export type WindowState = 'normal' | 'minimised' | 'maximised' | 'snapped-left' | 'snapped-right';

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  icon: string;
  state: WindowState;
  rect: WindowRect;
  previousRect?: WindowRect;
  zIndex: number;
  minWidth: number;
  minHeight: number;
  isFocused: boolean;
}

export type AppCategory = 'Operations' | 'Records' | 'Intelligence' | 'Communications' | 'Administration' | 'Navigation';

export interface AppDefinition {
  id: string;
  name: string;
  shortName?: string;
  subtitle?: string;
  description: string;
  category: AppCategory;
  badgeCode: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  defaultGridPos: { row: number; col: number };
  component: React.ComponentType<{ windowId: string; appId: string }>;
}

export type SnapTarget = 'none' | 'left' | 'right' | 'top';

export interface DesktopIconItem {
  id: string;
  appId: string;
  title: string;
  badgeCode: string;
  icon: string;
  gridCol: number;
  gridRow: number;
}
```

**Convention:** British spelling `minimised` is used everywhere in state checks.

---

## Window Manager API (`useWindowManager`)

| Method | Behavior |
|--------|----------|
| `openWindow(appId)` | Creates window or focuses existing (**single instance per appId**) |
| `closeWindow(windowId)` | Removes window; promotes next highest z-index |
| `minimizeWindow(windowId)` | Sets `state: 'minimised'` |
| `maximizeWindow(windowId)` | Saves `previousRect`, sets `state: 'maximised'` |
| `restoreWindow(windowId)` | Restores `previousRect`, sets `state: 'normal'` |
| `focusWindow(windowId)` | Increments z-index, sets `isFocused: true` |
| `toggleMinimizeWindow(windowId)` | Taskbar click: restore if minimised, minimise if focused, focus if background |
| `updateWindowRect(windowId, partial)` | Commits geometry after drag/resize |
| `setWindowDragging(isDragging, target?)` | Updates `snapTarget` for overlay preview |
| `applySnap(windowId, target)` | Applies left/right/top snap or maximise |
| `isAppOpen(appId)` | Whether app has an open window |
| `getOpenWindowByAppId(appId)` | Returns `WindowInstance` or undefined |

**State exposed:** `windows`, `activeWindowId`, `snapTarget`

**Open window algorithm:**
1. `getAppById(appId)` — abort if missing
2. If window for `appId` exists → focus + un-minimise
3. Else create new `WindowInstance`:
   - ID: `win-${appId}-${Date.now()}`
   - Cascading offset: `(windows.length % 6) * 32px`
   - Size clamped to viewport
   - Mobile (`< 640px`): starts `maximised`
   - z-index from counter starting at 100

**No persistence:** Window positions and open windows reset on page reload.

---

## App Registry Pattern (`src/config/apps.config.ts`)

Every app is one entry in `APP_REGISTRY`:

```ts
import type { AppDefinition } from '../types';
import { PlaceholderApp } from '../components/apps/PlaceholderApp';

export const APP_REGISTRY: Record<string, AppDefinition> = {
  home: {
    id: 'home',
    name: 'Home',
    shortName: 'Home',
    subtitle: 'Main application',
    description: 'Default placeholder app.',
    category: 'Operations',
    badgeCode: 'APP-01',
    icon: 'shield',
    defaultSize: { width: 800, height: 540 },
    minSize: { width: 480, height: 360 },
    defaultGridPos: { row: 0, col: 0 },
    component: PlaceholderApp,
  },
};

export const APP_LIST: AppDefinition[] = Object.values(APP_REGISTRY);

export function getAppById(appId: string): AppDefinition | undefined {
  return APP_REGISTRY[appId];
}
```

**To add an app:**
1. Create `src/components/apps/YourApp.tsx`
2. Add entry to `APP_REGISTRY`
3. Add icon alias to `AppIconRenderer` if needed
4. Icon appears on desktop + start menu automatically

---

## Blank App Template

Every app receives `{ windowId, appId }` and must fill its window:

```tsx
import React from 'react';

export const PlaceholderApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-text">
      <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
        Empty app — replace with your game UI
      </div>
    </div>
  );
};
```

**App conventions:**
- Root element: `h-full` to fill the window content area
- Add `select-text` on content areas (global CSS sets `user-select: none`)
- Use `useIsMobile(640)` for internal responsive layouts if needed
- `windowId` / `appId` props are available but optional

---

## Desktop Layout (`Desktop.tsx`)

Layer stack bottom → top:

| Layer | z-index | Notes |
|-------|---------|-------|
| Wallpaper + watermark | — | `bg-workstation-pattern`, decorative only |
| `DesktopIconGrid` | 10 (50 when dragging) | `bottom-14` to clear taskbar |
| Windows | 100+ dynamic | `pointer-events-none` container, `auto` per window |
| `SnapOverlay` | 999 | Translucent snap preview |
| `Taskbar` | 500 | Fixed `h-11` (44px) bottom bar |
| `UpdateNotifier` | 9999 | Optional Electron toast |

```tsx
export const Desktop: React.FC = () => {
  const { windows, snapTarget } = useWindowManager();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-workstation-pattern select-none flex flex-col text-slate-100">
      <DesktopIconGrid />
      <div className="absolute inset-0 pointer-events-none">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <WindowFrame window={win} />
          </div>
        ))}
      </div>
      <SnapOverlay snapTarget={snapTarget} />
      <Taskbar />
    </div>
  );
};
```

Replace police watermark/branding in `Desktop.tsx` with your game's theme.

---

## Window Frame (`WindowFrame.tsx`)

**Critical pattern — imperative DOM during drag/resize:**

1. `onPointerDown` on title bar with `setPointerCapture`
2. During `pointermove`: update `element.style.transform` directly (**no React re-renders**)
3. On `pointerup`: commit final position via `updateWindowRect` or `applySnap`

This keeps drag at 60–120fps without React render storms.

**Window states:**

| State | Layout |
|-------|--------|
| `minimised` | Returns `null` |
| `normal` | Absolute, `translate3d(x, y, 0)` + width/height |
| `maximised` | `fixed`, inset `top:4 left:4 right:4 bottom:48` |
| `snapped-left` | Left 50%: `width: calc(50vw - 6px)` |
| `snapped-right` | Right 50% |

**Snap detection (25px threshold):**
- `clientY <= 25` → top (maximise)
- `clientX <= 25` → left half
- `clientX >= innerWidth - 25` → right half

**Resize:** 8 invisible edge/corner handles (N, S, E, W, NE, NW, SE, SW). Disabled when maximised, snapped, or mobile.

**App mounting:**
```tsx
const AppComponent = appDef?.component;
<AppComponent windowId={win.id} appId={win.appId} />
```

---

## Desktop Icon Grid (`DesktopIconGrid.tsx`)

| Constant | Value |
|----------|-------|
| Cell size | 104 × 112 px |
| Padding | 24 px top/left |
| Drag threshold | 6 px before drag starts |
| Double-tap window | 350 ms |

| Action | Behavior |
|--------|----------|
| Single click | Select icon |
| Double click / double tap | `openWindow(appId)` |
| Mobile single tap | Opens app immediately |
| Drag | Reposition to nearest free grid cell |
| Click empty desktop | Deselect |

Icons initialise from `APP_LIST` + `defaultGridPos`. Collision avoidance scans a 12×12 grid for free cells.

---

## Taskbar & Start Menu

**Taskbar:**
- One tab per window (including minimised)
- Click tab → `toggleMinimizeWindow`
- Start button toggles `StartMenu`
- `id="start-menu-button"` for click-outside detection

**Start Menu:**
- Search filters name, description, category
- Apps grouped by `category`
- Each row: icon, name, badge code, subtitle
- Click row → `openWindow(appId)` + close menu
- z-index: 1000

**System Tray:**
- Customise status badges for your game
- Live clock (updates every 1s)
- In Precinct Command: AI status badge opens Settings app

---

## Icon Renderer (`AppIconRenderer.tsx`)

Maps string names to Lucide icons. Add aliases for your app icon names:

```tsx
case 'dispatch':
case 'radio':
case 'cad':
  return <Radio {...iconProps} />;
```

Default fallback: `Shield`.

---

## Styling (`src/index.css`)

**Stack:** Tailwind CSS v4 via `@import "tailwindcss"` + `@tailwindcss/vite`.

**Key custom classes:**

```css
.bg-workstation-pattern {
  background-color: #0d1527;
  background-image:
    radial-gradient(circle at 50% 40%, rgba(30, 58, 110, 0.35) 0%, rgba(13, 21, 39, 0.95) 100%),
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 100% 100%, 36px 36px, 36px 36px;
}

.window-shadow { /* unfocused drop shadow */ }
.window-shadow-focused { /* blue ring glow */ }
.icon-text-shadow { /* desktop label readability */ }
```

**Global rules:**
- `user-select: none` on all elements
- `body`: `overflow: hidden`, full viewport, dark `#0b1120` background

**Add these missing utilities** (referenced in JSX but not defined):

```css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.15s ease-out; }

.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
```

**Typography:** Inter (UI), JetBrains Mono (badge codes). Loaded in `index.html` from Google Fonts.

**Color palette:** Slate darks for chrome, sky/blue accents, white content areas inside windows.

---

## Mobile Behavior (`useIsMobile(640)`)

At viewport `< 640px`:
- Windows always maximised
- No drag, resize, snap, or maximise button
- Desktop icons: tap opens app, forced 3-column grid
- Single tap on icon opens (no double-tap needed)

Tablets at 768px+ retain floating windows.

---

## Z-Index Map

| Layer | z-index |
|-------|---------|
| Desktop icons (normal) | 10 |
| Desktop icons (dragging) | 50 |
| Windows | 100+ (monotonic counter) |
| Taskbar | 500 |
| Snap overlay | 999 |
| Start menu | 1000 |
| Update notifier | 9999 |

---

## Minimal `App.tsx` for Blank Shell

Remove game-specific boot and AI provider:

```tsx
import React from 'react';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { Desktop } from './components/desktop/Desktop';

export function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}

export default App;
```

Optionally open a default app on mount:

```tsx
const Boot: React.FC = () => {
  const { openWindow } = useWindowManager();
  useEffect(() => { openWindow('home'); }, [openWindow]);
  return <Desktop />;
};
```

---

## Rebuild Order (for a new project)

1. Scaffold Vite + React + TypeScript + Tailwind v4
2. Copy `src/types/index.ts`
3. Copy `src/context/WindowManagerContext.tsx`
4. Create `src/config/apps.config.ts` with one placeholder app
5. Copy window components: `WindowFrame`, `SnapOverlay`
6. Copy desktop components: `Desktop`, `DesktopIconGrid`
7. Copy taskbar components: `Taskbar`, `StartMenu`, `SystemTray`
8. Copy `AppIconRenderer`, `useIsMobile`, `index.css`
9. Wire `App.tsx` → `Desktop`
10. Customise wallpaper/branding in `Desktop.tsx`
11. Add your game apps to `APP_REGISTRY`

---

## Vite Config Essentials

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
```

For PWA, add `vite-plugin-pwa` with `display: 'standalone'` and dark `theme_color`.

---

## What Makes This Shell Distinctive

1. **Imperative drag** — DOM mutation during pointer move, React commit on release
2. **Single-instance apps** — one window per `appId`
3. **Snap with preview** — `setWindowDragging` drives `SnapOverlay` during drag
4. **Cascading window placement** — new windows offset diagonally
5. **Registry-driven** — desktop icons and start menu auto-populate from `APP_LIST`
6. **Kiosk feel** — `overflow: hidden`, `user-select: none`, full-viewport desktop
7. **Government/workstation aesthetic** — dark grid wallpaper, badge codes, mono labels

---

## Source Reference (this repo)

All shell source lives under `/workspace/src/` in this repository. The authoritative implementations are:

- `src/context/WindowManagerContext.tsx` — 346 lines, window state machine
- `src/components/window/WindowFrame.tsx` — 431 lines, drag/resize/snap chrome
- `src/components/desktop/DesktopIconGrid.tsx` — 238 lines, icon grid
- `src/components/taskbar/StartMenu.tsx` — searchable launcher
- `src/components/taskbar/Taskbar.tsx` — window tabs + start button
- `src/config/apps.config.ts` — app registry (replace entries for your game)

Clone or copy these files directly when bootstrapping a new project.

---

## Checklist for Blank Shell Verification

- [ ] Desktop wallpaper renders full viewport
- [ ] Desktop icons appear from `APP_LIST`
- [ ] Double-click icon opens window
- [ ] Window drags smoothly (title bar)
- [ ] Window resizes from edges/corners
- [ ] Snap left/right/top works with overlay preview
- [ ] Minimise / maximise / close buttons work
- [ ] Taskbar shows open windows, click toggles minimise
- [ ] Start menu lists apps, search filters, click opens
- [ ] Only one window per app ID
- [ ] Focus ring / z-index promotes clicked window
- [ ] Mobile: fullscreen windows, tap-to-open icons

---

*Generated from Precinct Command (`text-based-police-game-v2`). Use this file as the single source of truth for rebuilding the desktop shell in another repo.*
