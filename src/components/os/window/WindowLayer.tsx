"use client";

import type { ReactNode } from "react";
import { AboutWindowContent } from "@/components/os/windows/AboutWindowContent";
import { ContactWindowContent } from "@/components/os/windows/ContactWindowContent";
import { ExperienceWindowContent } from "@/components/os/windows/ExperienceWindowContent";
import { NdaVaultWindowContent } from "@/components/os/windows/NdaVaultWindowContent";
import { PlaceholderWindowContent } from "@/components/os/windows/PlaceholderWindowContent";
import { ResumeWindowContent } from "@/components/os/windows/ResumeWindowContent";
import { WindowFrame } from "./WindowFrame";
import { useWindowManager } from "./WindowManagerContext";
import type { WindowId } from "./types";

function renderWindowContent(id: WindowId, title: string): ReactNode {
  switch (id) {
    case "about":
      return <AboutWindowContent />;
    case "experience":
      return <ExperienceWindowContent />;
    case "nda":
      return <NdaVaultWindowContent />;
    case "contact":
      return <ContactWindowContent />;
    case "resume":
      return <ResumeWindowContent />;
    default:
      return <PlaceholderWindowContent title={title} />;
  }
}

export function WindowLayer() {
  const { state } = useWindowManager();

  const visibleWindows = state.windowOrder
    .map((id) => state.windows[id])
    .filter((window) => window && window.isOpen && !window.isMinimized);

  return (
    <>
      {visibleWindows.map((window) => (
        <WindowFrame key={window.id} window={window}>
          {renderWindowContent(window.id, window.title)}
        </WindowFrame>
      ))}
    </>
  );
}
