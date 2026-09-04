"use client";

import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { SystemClock } from "@/components/os/SystemClock";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";

const SKILLS = {
  Frontend: [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Motion",
    "Svelte",
  ],
  "Architecture & Systems": [
    "Microfrontends",
    "Module Federation",
    "Component Libraries",
    "Design Systems",
    "Monorepos",
  ],
  Testing: ["Jest", "React Testing Library", "Playwright"],
  "Tools & Workflow": ["Git", "pnpm", "ESLint", "Prettier"],
  "Data Viz & Maps": ["D3.js", "Leaflet", "Chart.js"],
} as const;

function TrayIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex size-5 items-center justify-center text-os-text-muted"
      aria-label={label}
      title={label}
    >
      {children}
    </span>
  );
}

function SkillsDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="os-menu-dropdown" onMouseLeave={onClose}>
      <div className="os-menu-dropdown__content">
        {Object.entries(SKILLS).map(([category, items]) => (
          <div key={category} className="os-menu-dropdown__section">
            <h5 className="os-menu-dropdown__category">{category}</h5>
            <ul className="os-menu-dropdown__list">
              {items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function WindowMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { state, focusWindow, openWindow } = useWindowManager();

  if (!isOpen) return null;

  const openWindows = Object.values(state.windows)
    .filter((window) => window.isOpen)
    .sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="os-menu-dropdown" onMouseLeave={onClose}>
      <div className="os-menu-dropdown__content os-menu-dropdown__content--window">
        {openWindows.length === 0 ? (
          <p className="os-menu-dropdown__empty">No windows open</p>
        ) : (
          <ul className="os-menu-dropdown__list">
            {openWindows.map((window) => (
              <li key={window.id}>
                <button
                  type="button"
                  className="os-menu-dropdown__item"
                  onClick={() => {
                    focusWindow(window.id);
                    onClose();
                  }}
                >
                  {window.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HelpMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="os-menu-dropdown" onMouseLeave={onClose}>
      <div className="os-menu-dropdown__content os-menu-dropdown__content--help">
        <h5 className="os-menu-dropdown__category">Built with</h5>
        <ul className="os-menu-dropdown__list">
          <li>Next.js 16</li>
          <li>React 19</li>
          <li>Tailwind CSS v4</li>
          <li>Motion</li>
        </ul>
      </div>
    </div>
  );
}

export function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { openWindow } = useWindowManager();

  const toggleMenu = useCallback((menu: string) => {
    setActiveMenu((current) => (current === menu ? null : menu));
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  return (
    <header className="os-menubar" role="banner">
      <div className="flex min-w-0 items-center gap-os-3">
        <span className="shrink-0 text-xs font-semibold tracking-tight text-os-text">
          Hanie OS
        </span>
        <nav
          className="hidden items-center gap-os-3 md:flex"
          aria-label="System menu"
        >
          <button
            type="button"
            className={`rounded-os-sm px-1 py-0.5 text-os-xs transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none ${
              activeMenu === "skills"
                ? "bg-white/5 text-os-text"
                : "text-os-text-muted hover:text-os-text"
            }`}
            onClick={() => toggleMenu("skills")}
          >
            Skills
          </button>
          <button
            type="button"
            className={`rounded-os-sm px-1 py-0.5 text-os-xs transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none ${
              activeMenu === "window"
                ? "bg-white/5 text-os-text"
                : "text-os-text-muted hover:text-os-text"
            }`}
            onClick={() => toggleMenu("window")}
          >
            Window
          </button>
          <button
            type="button"
            className={`rounded-os-sm px-1 py-0.5 text-os-xs transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none ${
              activeMenu === "help"
                ? "bg-white/5 text-os-text"
                : "text-os-text-muted hover:text-os-text"
            }`}
            onClick={() => toggleMenu("help")}
          >
            Help
          </button>
        </nav>
        <SkillsDropdown isOpen={activeMenu === "skills"} onClose={closeMenu} />
        <WindowMenu isOpen={activeMenu === "window"} onClose={closeMenu} />
        <HelpMenu isOpen={activeMenu === "help"} onClose={closeMenu} />
      </div>

      <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 sm:block">
        <p className="inline-flex items-center gap-1.5 rounded-os-pill border border-os-border bg-black/25 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wide text-os-status">
          <span
            className="size-1.5 rounded-full bg-os-status shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-hidden="true"
          />
          OPEN TO OPPORTUNITIES
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-os-2 sm:gap-os-3">
        <div
          className="hidden items-center gap-os-2 sm:flex"
          aria-hidden="true"
        >
          <TrayIcon label="Network">
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M2 8.5c6-5 14-5 20 0" />
              <path d="M5.5 12c4-3.5 9-3.5 13 0" />
              <path d="M9 15.5c2.2-1.8 3.8-1.8 6 0" />
              <circle
                cx="12"
                cy="18.5"
                r="1.1"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </TrayIcon>
          <TrayIcon label="Volume">
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 10v4h3l4 3V7l-4 3H4z" />
              <path d="M16 9.5a4 4 0 0 1 0 5" />
            </svg>
          </TrayIcon>
          <TrayIcon label="Battery">
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="2.5" y="7.5" width="16" height="9" rx="2" />
              <path d="M20.5 10.5v3" />
              <rect
                x="4.5"
                y="9.5"
                width="10"
                height="5"
                rx="1"
                fill="currentColor"
                stroke="none"
                opacity="0.7"
              />
            </svg>
          </TrayIcon>
        </div>
        <SystemClock />
        <button
          type="button"
          className="inline-flex size-6 items-center justify-center rounded-os-sm text-os-text-muted transition-colors hover:bg-white/5 hover:text-os-text focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent/60"
          aria-label="Search"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16.5 16.5 21 21" />
          </svg>
        </button>
      </div>
    </header>
  );
}
