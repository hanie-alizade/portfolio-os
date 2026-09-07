"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SystemClock } from "@/components/os/SystemClock";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";
import { useMenuBar } from "@/components/os/MenuBarContext";

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
  const [shouldRender, setShouldRender] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setHasEntered(false);
      setOpenCategory(null);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHasEntered(true));
      });
    } else {
      setHasEntered(false);
      setOpenCategory(null);
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCategoryHover = (category: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setOpenCategory(category);
  };

  const handleCategoryLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => setOpenCategory(null), 250);
    setHoverTimeout(timeout);
  };

  const handleCategoryClick = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenCategory(openCategory === category ? null : category);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpenCategory(null);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`os-menu-dropdown ${
        hasEntered && !reducedMotion ? "os-menu-dropdown--enter" : ""
      }`}
      onMouseLeave={onClose}
    >
      <div className="os-menu-dropdown__content">
        <ul className="os-menu-dropdown__list">
          {Object.keys(SKILLS).map((category) => (
            <li key={category}>
              <button
                type="button"
                className="os-menu-dropdown__item flex justify-between"
                onMouseEnter={() => handleCategoryHover(category)}
                onMouseLeave={handleCategoryLeave}
                onClick={() => handleCategoryClick(category)}
                onKeyDown={(e) => handleKeyDown(e, category)}
                aria-haspopup="true"
                aria-expanded={openCategory === category}
              >
                {category}
                <span className="ml-auto text-os-text-subtle">▸</span>
              </button>
              {openCategory === category && (
                <div
                  className={`os-menu-dropdown os-menu-dropdown--submenu ${
                    hasEntered && !reducedMotion
                      ? "os-menu-dropdown--enter"
                      : ""
                  }`}
                  style={{
                    position: "absolute",
                    left: "100%",
                    top: 0,
                    marginLeft: "0.25rem",
                    transformOrigin: "left center",
                  }}
                  onMouseEnter={() => {
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout);
                    }
                  }}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="os-menu-dropdown__content">
                    <ul className="os-menu-dropdown__list">
                      {SKILLS[category as keyof typeof SKILLS].map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
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
  const [shouldRender, setShouldRender] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setHasEntered(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHasEntered(true));
      });
    } else {
      setHasEntered(false);
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const openWindows = Object.values(state.windows)
    .filter((window) => window.isOpen)
    .sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div
      className={`os-menu-dropdown ${
        hasEntered && !reducedMotion ? "os-menu-dropdown--enter" : ""
      }`}
      onMouseLeave={onClose}
    >
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
  const [shouldRender, setShouldRender] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setHasEntered(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHasEntered(true));
      });
    } else {
      setHasEntered(false);
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`os-menu-dropdown ${
        hasEntered && !reducedMotion ? "os-menu-dropdown--enter" : ""
      }`}
      onMouseLeave={onClose}
    >
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

function DynamicIsland() {
  const { state } = useWindowManager();
  const activeWindow = Object.values(state.windows).find(
    (w) => w.isOpen && !w.isMinimized
  );

  return (
    <div
      className={`os-dynamic-island${
        activeWindow ? " os-dynamic-island--active" : ""
      }`}
      aria-live="polite"
    >
      {activeWindow ? (
        <span className="os-dynamic-island__label">{activeWindow.title}</span>
      ) : null}
    </div>
  );
}

export function MenuBar() {
  const { activeMenu, openMenu, closeMenu } = useMenuBar();
  const { openWindow } = useWindowManager();

  const toggleMenu = useCallback(
    (menu: string) => {
      if (activeMenu === menu) {
        closeMenu();
      } else {
        openMenu(menu);
      }
    },
    [activeMenu, openMenu, closeMenu]
  );

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

      <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 md:hidden">
        <DynamicIsland />
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
