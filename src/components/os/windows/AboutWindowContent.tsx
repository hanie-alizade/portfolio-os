"use client";

import Image from "next/image";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";

const HIGHLIGHTS = [
  "React",
  "TypeScript",
  "Next.js",
  "UI Architecture",
  "Performance",
] as const;

export function AboutWindowContent() {
  const { openWindow } = useWindowManager();

  return (
    <div className="os-window-content os-window-content--about">
      <div className="os-window-content__copy">
        <p className="os-eyebrow">Frontend Engineer</p>
        <h3 className="os-window-heading">
          Hi, I&apos;m Hanie <span aria-hidden="true">👋</span>
        </h3>
        <p className="os-window-copy">
          I build polished, performant interfaces with React, TypeScript, and
          Next.js — from scalable UI systems to interactive product experiences.
        </p>
        <div className="os-chip-row" aria-label="Key highlights">
          {HIGHLIGHTS.map((highlight) => (
            <span key={highlight} className="os-chip">
              {highlight}
            </span>
          ))}
        </div>
        <div className="os-action-row">
          <button
            type="button"
            className="os-btn os-btn--primary"
            onClick={() => openWindow("resume")}
          >
            Resume
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
