"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  type MotionValue,
} from "motion/react";
import type { DockAppId } from "@/components/os/appIds";
import { useWindowManager } from "@/components/os/window/WindowManagerContext";

export type { DockAppId };

type DockApp = { id: DockAppId; label: string; hint: string; icon: string };

const dockApps: DockApp[] = [
  {
    id: "about",
    label: "About",
    hint: "This is me",
    icon: "/os/dockIcons/about.png",
  },
  {
    id: "experience",
    label: "Experience",
    hint: "My journey",
    icon: "/os/dockIcons/experience.png",
  },
  {
    id: "nda",
    label: "NDA",
    hint: "Locked work",
    icon: "/os/dockIcons/nda.png",
  },
  {
    id: "case-studies",
    label: "Case Studies",
    hint: "Deep dive",
    icon: "/os/dockIcons/case-studies.png",
  },
  {
    id: "resume",
    label: "Resume",
    hint: "Download CV",
    icon: "/os/dockIcons/resume.png",
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Get in touch",
    icon: "/os/dockIcons/contact.png",
  },
];

const BASE_SIZE = 44;
const MAX_SIZE = 68;

function DockIcon({
  app,
  mouseX,
  isRunning,
  isFocused,
  onClick,
}: {
  app: DockApp;
  mouseX: MotionValue<number>;
  isRunning: boolean;
  isFocused: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  // distance between cursor and this icon's own center — read live from the DOM
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });

  const scaleTarget = useTransform(
    distance,
    [-100, 0, 100],
    [1, MAX_SIZE / BASE_SIZE, 1]
  );
  const scale = useSpring(scaleTarget, {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  });

  return (
    <button
      ref={ref}
      type="button"
      className="os-dock-item"
      aria-label={`${app.label}: ${app.hint}`}
      aria-current={isFocused ? "true" : undefined}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="os-dock-item__tooltip"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {app.label}
        {/* <span className="os-dock-item__tooltip-arrow" aria-hidden="true" /> */}
      </motion.span>
      <motion.div className="os-dock-item__icon-wrap" style={{ scale }}>
        <Image
          src={app.icon}
          alt=""
          width={BASE_SIZE}
          height={BASE_SIZE}
          className="os-dock-item__icon"
        />
      </motion.div>
      {isRunning ? (
        <span className="os-dock-item__indicator" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export function Dock() {
  const { state, launchApp, getWindowByAppId } = useWindowManager();
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      className="os-dock"
      aria-label="Application dock"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {dockApps.map((app) => {
        const managed = getWindowByAppId(app.id);
        const isRunning = Boolean(managed?.isOpen);
        const isFocused =
          Boolean(managed) &&
          state.focusedId === managed?.id &&
          !managed?.isMinimized;

        return (
          <DockIcon
            key={app.id}
            app={app}
            mouseX={mouseX}
            isRunning={isRunning}
            isFocused={isFocused}
            onClick={() => launchApp(app.id)}
          />
        );
      })}
    </nav>
  );
}
