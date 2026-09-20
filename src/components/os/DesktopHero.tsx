"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { DesktopWidget } from "./DesktopWidget";

const TerminalWindowContent = dynamic(
  () =>
    import("./windows/TerminalWindowContent").then(
      (m) => m.TerminalWindowContent
    ),
  {
    ssr: false,
    loading: () => <div className="os-window__body" aria-busy="true" />,
  }
);

const SystemStatsWindowContent = dynamic(
  () =>
    import("./windows/SystemStatsWindowContent").then(
      (m) => m.SystemStatsWindowContent
    ),
  {
    ssr: false,
    loading: () => <div className="os-window__body" aria-busy="true" />,
  }
);

export function DesktopHero() {
  const [focusedWidget, setFocusedWidget] = useState<string>("terminal-widget");

  const getWidgetZIndex = useCallback(
    (id: string) => {
      return focusedWidget === id ? 2 : 1;
    },
    [focusedWidget]
  );

  const handleWidgetFocus = useCallback((id: string) => {
    setFocusedWidget(id);
  }, []);

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
        zIndex={getWidgetZIndex("terminal-widget")}
        onFocus={() => handleWidgetFocus("terminal-widget")}
      >
        <TerminalWindowContent />
      </DesktopWidget>

      <DesktopWidget
        id="system-stats-widget"
        initialBounds={{ x: 10, y: 350, width: 300, height: 360 }}
        zIndex={getWidgetZIndex("system-stats-widget")}
        onFocus={() => handleWidgetFocus("system-stats-widget")}
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
