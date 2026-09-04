"use client";

import type { ReactNode } from "react";
import type { DockAppId } from "@/components/os/appIds";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";

export type { DockAppId };

type DockApp = {
  id: DockAppId;
  label: string;
  hint: string;
  icon: ReactNode;
};

const dockApps: DockApp[] = [
  {
    id: "about",
    label: "About",
    hint: "This is me",
    icon: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="dock-about" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <path
          fill="url(#dock-about)"
          d="M16 3.5 18.8 11h7.7l-6.2 4.6 2.4 7.4L16 18.7l-6.7 4.3 2.4-7.4L5.5 11h7.7L16 3.5z"
        />
      </svg>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    hint: "My journey",
    icon: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="dock-exp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <rect
          x="5"
          y="11"
          width="22"
          height="14"
          rx="3"
          fill="url(#dock-exp)"
        />
        <path
          d="M12 11V9.5A2.5 2.5 0 0 1 14.5 7h3A2.5 2.5 0 0 1 20 9.5V11"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: "nda",
    label: "NDA Vault",
    hint: "Locked work",
    icon: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="dock-nda" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        <path
          fill="url(#dock-nda)"
          d="M16 4c-4 0-7 2.6-7 6.2V13H7.5A2.5 2.5 0 0 0 5 15.5v9A2.5 2.5 0 0 0 7.5 27h17a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 24.5 13H23v-2.8C23 6.6 20 4 16 4zm0 2.2c2.7 0 4.8 1.6 4.8 3.8V13h-9.6V10c0-2.2 2.1-3.8 4.8-3.8z"
        />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    hint: "Download CV",
    icon: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="dock-resume" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          fill="url(#dock-resume)"
          d="M9 4.5h10l5 5V27a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 27V6A1.5 1.5 0 0 1 9.5 4.5H9zm9 .8V11h5.2L18 5.3z"
        />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Get in touch",
    icon: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <linearGradient id="dock-contact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          fill="url(#dock-contact)"
          d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm0 3c2.8 0 5 2.2 5 5v4c0 2.8-2.2 5-5 5s-5-2.2-5-5v-4c0-2.8 2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3v4c0 1.7 1.3 3 3 3s3-1.3 3-3v-4c0-1.7-1.3-3-3-3z"
        />
      </svg>
    ),
  },
];

export function Dock() {
  const { state, launchApp, getWindowByAppId } = useWindowManager();

  return (
    <nav className="os-dock" aria-label="Application dock">
      {dockApps.map((app) => {
        const managed = getWindowByAppId(app.id);
        const isRunning = Boolean(managed?.isOpen);
        const isFocused =
          Boolean(managed) &&
          state.focusedId === managed?.id &&
          !managed?.isMinimized;

        return (
          <button
            key={app.id}
            type="button"
            className={`os-dock-item${
              isFocused ? " os-dock-item--active" : ""
            }`}
            aria-label={`${app.label}: ${app.hint}`}
            aria-current={isFocused ? "true" : undefined}
            onClick={() => launchApp(app.id)}
          >
            <span className="os-dock-item__icon">{app.icon}</span>
            <span className="os-dock-item__label">{app.label}</span>
            <span className="os-dock-item__hint">{app.hint}</span>
            {isRunning ? (
              <span className="os-dock-item__indicator" aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
