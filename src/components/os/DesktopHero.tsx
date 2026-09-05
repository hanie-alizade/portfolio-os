"use client";

import { DesktopWidget } from "./DesktopWidget";
import { TerminalWindowContent } from "./windows/TerminalWindowContent";
import { SystemStatsWindowContent } from "./windows/SystemStatsWindowContent";
import { StickyNoteWindowContent } from "./windows/StickyNoteWindowContent";

export function DesktopHero() {
  return (
    <>
      <div className="os-desktop-hero">
        <p className="os-desktop-hero__greeting">Hello,</p>
        <h2 className="os-desktop-hero__name">I&apos;m Hanieh</h2>
        <p className="os-desktop-hero__title">Frontend Engineer</p>
        <p className="os-desktop-hero__tagline">
          I build experiences that
          <br />
          users love.
        </p>
      </div>

      <DesktopWidget
        id="terminal-widget"
        initialBounds={{ x: 2000, y: 420, width: 450, height: 145 }}
      >
        <TerminalWindowContent />
      </DesktopWidget>

      <DesktopWidget
        id="system-stats-widget"
        initialBounds={{ x: 10, y: 300, width: 300, height: 360 }}
      >
        <SystemStatsWindowContent />
      </DesktopWidget>

      {/* <DesktopWidget
        id="sticky-widget"
        initialBounds={{ x: 950, y: 430, width: 250, height: 160 }}
      >
        <StickyNoteWindowContent />
      </DesktopWidget> */}
    </>
  );
}
