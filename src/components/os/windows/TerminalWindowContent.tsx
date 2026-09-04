"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "Frontend Engineer",
  "Problem Solver",
  "UI/UX Enthusiast",
  "Bug Hunter",
] as const;

const SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "UI Architecture",
  "Performance",
  "Design",
] as const;

export function TerminalWindowContent() {
  const [caretVisible, setCaretVisible] = useState(true);

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
        <span className="os-terminal__prompt">hanie@os:~$</span> whoami
      </p>
      <ul className="os-terminal__list">
        {ROLES.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
      <p>
        <span className="os-terminal__prompt">hanie@os:~$</span> skills --list
      </p>
      <ul className="os-terminal__list">
        {SKILLS.map((skill) => (
          <li key={skill}>&raquo; {skill}</li>
        ))}
      </ul>
      <p>
        <span className="os-terminal__prompt">hanie@os:~$</span> mission
      </p>
      <p className="os-terminal__out">
        Building interfaces that feel fast, intentional, and enjoyable to use.
      </p>
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
