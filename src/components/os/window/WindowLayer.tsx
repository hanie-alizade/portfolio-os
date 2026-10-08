import type { ReactNode } from "react";
import { Suspense, lazy } from "react";
import { PlaceholderWindowContent } from "@/components/os/windows/PlaceholderWindowContent";
import { WindowFrame } from "./WindowFrame";
import { useWindowManager } from "./WindowManagerContext";
import type { WindowId } from "./types";

const AboutWindowContent = lazy(() =>
  import("@/components/os/windows/AboutWindowContent").then((m) => ({
    default: m.AboutWindowContent,
  }))
);
const CaseStudiesWindowContent = lazy(() =>
  import("@/components/os/windows/CaseStudiesWindowContent").then((m) => ({
    default: m.CaseStudiesWindowContent,
  }))
);
const ContactWindowContent = lazy(() =>
  import("@/components/os/windows/ContactWindowContent").then((m) => ({
    default: m.ContactWindowContent,
  }))
);
const ExperienceWindowContent = lazy(() =>
  import("@/components/os/windows/ExperienceWindowContent").then((m) => ({
    default: m.ExperienceWindowContent,
  }))
);
const NdaWindowContent = lazy(() =>
  import("@/components/os/windows/NdaWindowContent").then((m) => ({
    default: m.NdaWindowContent,
  }))
);
const ResumeWindowContent = lazy(() =>
  import("@/components/os/windows/ResumeWindowContent").then((m) => ({
    default: m.ResumeWindowContent,
  }))
);

function renderWindowContent(id: WindowId, title: string): ReactNode {
  const loadingFallback = <div className="os-window__body" aria-busy="true" />;

  switch (id) {
    case "about":
      return (
        <Suspense fallback={loadingFallback}>
          <AboutWindowContent />
        </Suspense>
      );
    case "experience":
      return (
        <Suspense fallback={loadingFallback}>
          <ExperienceWindowContent />
        </Suspense>
      );
    case "nda":
      return (
        <Suspense fallback={loadingFallback}>
          <NdaWindowContent />
        </Suspense>
      );
    case "case-studies":
      return (
        <Suspense fallback={loadingFallback}>
          <CaseStudiesWindowContent />
        </Suspense>
      );
    case "contact":
      return (
        <Suspense fallback={loadingFallback}>
          <ContactWindowContent />
        </Suspense>
      );
    case "resume":
      return (
        <Suspense fallback={loadingFallback}>
          <ResumeWindowContent />
        </Suspense>
      );
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
