
import { useState, useCallback, Suspense, lazy } from "react";
import { DesktopWidget } from "./DesktopWidget";

const TerminalWindowContent = lazy(() =>
  import("./windows/TerminalWindowContent").then((m) => ({
    default: m.TerminalWindowContent,
  }))
);
const SystemStatsWindowContent = lazy(() =>
  import("./windows/SystemStatsWindowContent").then((m) => ({
    default: m.SystemStatsWindowContent,
  }))
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
        <Suspense
          fallback={<div className="os-window__body" aria-busy="true" />}
        >
          <TerminalWindowContent />
        </Suspense>
      </DesktopWidget>

      <DesktopWidget
        id="system-stats-widget"
        initialBounds={{ x: 10, y: 350, width: 300, height: 360 }}
        zIndex={getWidgetZIndex("system-stats-widget")}
        onFocus={() => handleWidgetFocus("system-stats-widget")}
      >
        <Suspense
          fallback={<div className="os-window__body" aria-busy="true" />}
        >
          <SystemStatsWindowContent />
        </Suspense>
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
