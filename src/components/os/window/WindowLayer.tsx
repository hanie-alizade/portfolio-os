"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { PlaceholderWindowContent } from "@/components/os/windows/PlaceholderWindowContent";
import { WindowFrame } from "./WindowFrame";
import { useWindowManager } from "./WindowManagerContext";
import type { WindowId } from "./types";

const AboutWindowContent = dynamic(
  () =>
    import("@/components/os/windows/AboutWindowContent").then(
      (m) => m.AboutWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

const CaseStudiesWindowContent = dynamic(
  () =>
    import("@/components/os/windows/CaseStudiesWindowContent").then(
      (m) => m.CaseStudiesWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

const ContactWindowContent = dynamic(
  () =>
    import("@/components/os/windows/ContactWindowContent").then(
      (m) => m.ContactWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

const ExperienceWindowContent = dynamic(
  () =>
    import("@/components/os/windows/ExperienceWindowContent").then(
      (m) => m.ExperienceWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

const NdaWindowContent = dynamic(
  () =>
    import("@/components/os/windows/NdaWindowContent").then(
      (m) => m.NdaWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

const ResumeWindowContent = dynamic(
  () =>
    import("@/components/os/windows/ResumeWindowContent").then(
      (m) => m.ResumeWindowContent
    ),
  { loading: () => <div className="os-window__body" aria-busy="true" /> }
);

function renderWindowContent(id: WindowId, title: string): ReactNode {
  switch (id) {
    case "about":
      return <AboutWindowContent />;
    case "experience":
      return <ExperienceWindowContent />;
    case "nda":
      return <NdaWindowContent />;
    case "case-studies":
      return <CaseStudiesWindowContent />;
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
