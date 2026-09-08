"use client";

import dynamic from "next/dynamic";

const DesktopShell = dynamic(
  () => import("@/components/os/DesktopShell").then((mod) => mod.DesktopShell),
  { ssr: false }
);

export default function HomePage() {
  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, background: "var(--os-bg)" }}
      />
      <DesktopShell />
    </>
  );
}
