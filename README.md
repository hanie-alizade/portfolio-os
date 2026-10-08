# Hanie OS

An interactive OS-inspired portfolio built with React 19, TypeScript, Vite, Tailwind CSS v4, and Motion.

## Stack

- **React 19.2.4** — UI library
- **TypeScript** — type safety (strict)
- **Vite 8** — build tool and dev server
- **Tailwind CSS v4** — via `@tailwindcss/vite`
- **Motion** — animation library
- **Lucide React** — icons

## Scripts

```bash
npm ci               # Install dependencies from the lockfile
npm run dev          # Start the Vite development server
npm run build        # Typecheck and build for production (`dist/`)
npm run preview      # Preview the production build
npm run lint         # Run ESLint
npm run format       # Format files with Prettier
```

## Architecture

### Window manager

The desktop uses a custom window manager built with React Context + `useReducer`:

- `WindowManagerContext` — open/close, minimize, maximize, focus, z-index, and launch payloads
- `WindowFrame` — positioning, dragging, chrome, and window-level error boundaries
- `WindowLayer` — renders open windows with `React.lazy` + `Suspense` for content
- Window types — About, Experience, Case Studies, Contact, Resume, NDA Vault, plus desktop widgets (System Stats, Terminal, Music, Sticky Note)

### Mobile vs desktop

- **Desktop:** draggable windows, dock, menu bar, and particle background
- **Mobile** (`max-width: 767px`): home-screen grid and maximized windows

### Lazy loading

Dock-launched window content is code-split with `React.lazy` + `Suspense`, matching the previous Next.js `dynamic()` boundaries.

## Why Vite instead of Next.js?

This portfolio is fully client-side. The Next.js app used a single Server Component (`layout.tsx`) for fonts and metadata; `page.tsx` loaded the shell with `ssr: false`. There were no API routes and no real use of RSC/SSR beyond hydration cost. Vite keeps the same React UI with a simpler SPA build.

## Folder structure

```
index.html
vite.config.ts
public/
├── favicon.ico
├── robots.txt
├── resume.pdf
└── os/                      # desktop/window images and dock icons
src/
├── main.tsx
├── components/
│   ├── ErrorBoundary.tsx
│   └── os/
│       ├── DesktopShell.tsx
│       ├── Dock.tsx
│       ├── MenuBar.tsx
│       ├── globals.css
│       ├── window/
│       │   ├── WindowFrame.tsx
│       │   ├── WindowLayer.tsx
│       │   ├── WindowManagerContext.tsx
│       │   └── geometry.ts
│       └── windows/
├── hooks/
│   ├── useIsCompactViewport.ts
│   └── usePrefersReducedMotion.ts
└── lib/
    ├── contact.ts
    └── experience.ts
```

## Deployment

Configure Vercel as a **Vite** project with output directory `dist`. Deploy preview URLs from the `migrate-vite` branch; do not treat this branch as production until it is merged.

## Live site

https://portfolio-os-blond-sigma.vercel.app
