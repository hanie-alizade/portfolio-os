"use client";

import Image from "next/image";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";
import { useMenuBar } from "@/components/os/MenuBarContext";
import { getDisplayedYearsOfExperience } from "@/lib/experience";

const HIGHLIGHTS = [
  { label: "React", accent: "var(--os-cyan)" },
  { label: "TypeScript", accent: "var(--os-accent)" },
  { label: "Next.js", accent: "var(--os-text)" },
  { label: "Microfrontends", accent: "var(--os-pink)" },
  { label: "Performance", accent: "var(--os-green)" },
] as const;

export function AboutWindowContent() {
  const { openWindow } = useWindowManager();
  const { openMenu } = useMenuBar();
  const years = getDisplayedYearsOfExperience();

  return (
    <div className="os-window-content os-window-content--about">
      <div className="os-window-content__copy ">
        <div className="min-h-[100px] h-1/2 max-h-[180px] flex flex-col justify-between gap-2">
          <p className="os-eyebrow">Frontend Engineer</p>
          <h3 className="os-window-heading">
            I turn complex systems into interfaces people actually enjoy using.
          </h3>
          <div className="flex flex-col gap-1">
            <p className="os-window-copy">
              Senior Frontend Engineer with {years}+ years building production
              interfaces.
            </p>
            <p className="os-window-copy">
              From logistics dashboards handling 1,000+ orders a day, to wallet
              & transaction flows, enterprise platforms, and healthcare tools.
            </p>
          </div>
        </div>
        <div className="min-h-[60px] h-1/3 max-h-[80px] flex flex-col justify-between gap-2 items-center">
          <div className="os-chip-row" aria-label="Key highlights">
            {HIGHLIGHTS.map((highlight) => (
              <span
                key={highlight.label}
                className="os-chip"
                style={
                  { "--chip-accent": highlight.accent } as React.CSSProperties
                }
              >
                {highlight.label}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="os-link"
            onClick={() => openMenu("skills")}
          >
            + full stack in the Skills menu ↗
          </button>
        </div>
        <div className="os-action-row">
          <button
            type="button"
            className="os-btn os-btn--primary"
            onClick={() => openWindow("resume")}
          >
            RESUME.EXE
          </button>
          <button
            type="button"
            className="os-btn os-btn--ghost"
            onClick={() => openWindow("contact")}
          >
            Let&apos;s Talk
          </button>
        </div>
      </div>

      <div className="os-window-content__media os-window-content__media--plain">
        <Image
          src="/os/about-desktop.png"
          alt="Abstract geometric network visualization"
          width={1536}
          height={1024}
          className="os-window-media-image"
          loading="lazy"
        />
      </div>
    </div>
  );
}
