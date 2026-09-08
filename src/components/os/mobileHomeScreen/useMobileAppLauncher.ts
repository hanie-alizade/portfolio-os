"use client";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";
import type { DockAppId } from "@/components/os/appIds";

export function useMobileAppLauncher() {
  const { state, minimizeWindow, launchApp } = useWindowManager();

  return (appId: DockAppId) => {
    Object.values(state.windows).forEach((w) => {
      if (w.isOpen && !w.isMinimized) {
        minimizeWindow(w.id);
      }
    });
    launchApp(appId);
  };
}
