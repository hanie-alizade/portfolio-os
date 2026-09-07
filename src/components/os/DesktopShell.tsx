"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DesktopBackground } from "@/components/os/DesktopBackground";
import { DesktopHero } from "@/components/os/DesktopHero";
import { Dock } from "@/components/os/Dock";
import { MenuBar } from "@/components/os/MenuBar";
import { MenuBarProvider } from "@/components/os/MenuBarContext";
import { WindowLayer } from "@/components/os/window/WindowLayer";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/components/os/window/WindowManagerContext";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";
import { MobileHomeScreen } from "@/components/os/mobileHomeScreen/MobileHomeScreen";
import { BootSplash } from "@/components/os/BootSplash";

function DesktopShellContent({ children }: { children?: ReactNode }) {
  const isCompact = useIsCompactViewport();
  const { state } = useWindowManager();
  const [showBootSplash, setShowBootSplash] = useState(true);
  const hasOpenWindow = Object.values(state.windows).some(
    (w) => w.isOpen && !w.isMinimized
  );

  return (
    <div className="os-desktop">
      <DesktopBackground />
      <MenuBar />
      {showBootSplash && (
        <BootSplash
          variant={isCompact ? "mobile" : "desktop"}
          onComplete={() => setShowBootSplash(false)}
        />
      )}
      <main className="os-desktop-area" id="desktop-area">
        <h1 className="sr-only">Hanie OS — Frontend Engineer Portfolio</h1>
        {isCompact ? (
          <MobileHomeScreen hidden={hasOpenWindow} />
        ) : (
          <DesktopHero />
        )}
        <WindowLayer />
        {children}
        {!isCompact && <Dock />}
      </main>
    </div>
  );
}

export function DesktopShell({ children }: { children?: ReactNode }) {
  return (
    <WindowManagerProvider>
      <MenuBarProvider>
        <DesktopShellContent>{children}</DesktopShellContent>
      </MenuBarProvider>
    </WindowManagerProvider>
  );
}
