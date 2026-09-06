"use client";

import { useEffect, useState } from "react";
import { getDisplayedYearsOfExperience } from "@/lib/experience";

const GIT_COMMITS = [
  "a3f9c2e perf(boxy): lighthouse score 85 → 97",
  "7b1e4da feat(boxy): rbac system — 5 roles, 20+ permissions",
  "c9d0f31 fix(espad): grpc debug panel, -30% time-to-debug",
  // "4e2a8b7 feat(espad): cross-app messaging in microfrontend architecture",
  "019f6c4 init: first commit @ khishavere (aug 2019)",
] as const;

export function TerminalWindowContent() {
  const [caretVisible, setCaretVisible] = useState(true);
  const years = getDisplayedYearsOfExperience();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCaretVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="os-terminal">
      <p>
        <span className="os-terminal__prompt">hanie@os:~$</span> git log
        --oneline -{GIT_COMMITS.length}
      </p>
      <ul className="os-terminal__list">
        {GIT_COMMITS.map((commit) => (
          <li key={commit}>{commit}</li>
        ))}
      </ul>
      {/* <p>
        <span className="os-terminal__prompt">hanie@os:~$</span> fetch
      </p>
      <ul className="os-terminal__list">
        <li>OS: HanieOS 7.1 (Frontend Edition)</li>
        <li>Uptime: {years}+ years</li>
        <li>Shell: React / TypeScript / Next.js</li>
        <li>Resolution: pixel-perfect</li>
        <li>Fuel: ☕ infinite</li>
      </ul> */}
      <p className="os-terminal__line">
        <span className="os-terminal__prompt">hanie@os:~$</span>
        <span
          className={`os-terminal__caret${
            caretVisible ? " os-terminal__caret--visible" : ""
          }`}
          aria-hidden="true"
        />
      </p>
    </div>
  );
}
