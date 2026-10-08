import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { DesktopBackground } from "@/components/os/DesktopBackground";
import { DesktopHero } from "@/components/os/DesktopHero";
import { Dock } from "@/components/os/Dock";
import { MenuBar } from "@/components/os/MenuBar";
import { MenuBarProvider, useMenuBar } from "@/components/os/MenuBarContext";
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
  const { state, closeWindow } = useWindowManager();
  const { activeMenu, closeMenu } = useMenuBar();
  const [showBootSplash, setShowBootSplash] = useState(true);
  const hasOpenWindow = Object.values(state.windows).some(
    (w) => w.isOpen && !w.isMinimized
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeMenu) {
        closeMenu();
        return;
      }
      if (!state.focusedId) return;
      const focused = state.windows[state.focusedId];
      if (focused?.isOpen && !focused.isMinimized && focused.chrome !== "widget") {
        closeWindow(state.focusedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMenu, closeMenu, closeWindow, state.focusedId, state.windows]);

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
        <Dock />
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
