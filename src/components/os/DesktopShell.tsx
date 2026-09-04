import type { ReactNode } from "react";
import { DesktopBackground } from "@/components/os/DesktopBackground";
import { DesktopHero } from "@/components/os/DesktopHero";
import { Dock } from "@/components/os/Dock";
import { MenuBar } from "@/components/os/MenuBar";
import { WindowLayer } from "@/components/os/window/WindowLayer";
import { WindowManagerProvider } from "@/components/os/window/WindowManagerContext";

export function DesktopShell({ children }: { children?: ReactNode }) {
  return (
    <WindowManagerProvider>
      <div className="os-desktop">
        <DesktopBackground />
        <MenuBar />
        <main className="os-desktop-area" id="desktop-area">
          <h1 className="sr-only">Hanie OS — Frontend Engineer Portfolio</h1>
          <DesktopHero />
          <WindowLayer />
          {children}

          <Dock />
        </main>
      </div>
    </WindowManagerProvider>
  );
}
