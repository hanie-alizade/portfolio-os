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
import { useWindowManager } from "@/components/os/window/WindowManagerContext";
import type { DockApp } from "./dockApps";
import { dockApps } from "./dockApps";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";

const BASE_SIZE = 44;
const MAX_SIZE = 70;

function DockIcon({
  app,
  mouseX,
  isRunning,
  isFocused,
  onClick,
  isCompact,
}: {
  app: DockApp;
  mouseX: MotionValue<number>;
  isRunning: boolean;
  isFocused: boolean;
  onClick: () => void;
  isCompact: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  // Calculate distance using actual icon position
  const distance = useTransform(mouseX, (val) => {
    const iconRect = iconRef.current?.getBoundingClientRect();
    if (!iconRect) return Infinity;
    const iconCenter = iconRect.left + iconRect.width / 2;
    return val - iconCenter;
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

  const tooltipStyle = { opacity: hovered ? 1 : 0 };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  if (isCompact) {
    return (
      <button
        type="button"
        className="os-dock-item"
        aria-label={`${app.label}: ${app.hint}`}
        aria-current={isFocused ? "true" : undefined}
        onClick={onClick}
      >
        <span className="os-dock-item__tooltip" style={{ opacity: 0 }}>
          {app.label}
        </span>
        <div className="os-dock-item__icon-wrap" ref={iconRef}>
          <Image
            src={app.icon}
            alt=""
            width={BASE_SIZE}
            height={BASE_SIZE}
            className="os-dock-item__icon"
          />
        </div>
        {isRunning ? (
          <span className="os-dock-item__indicator" aria-hidden="true" />
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="os-dock-item"
      aria-label={`${app.label}: ${app.hint}`}
      aria-current={isFocused ? "true" : undefined}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span className="os-dock-item__tooltip" style={tooltipStyle}>
        {app.label}
        {/* <span className="os-dock-item__tooltip-arrow" aria-hidden="true" /> */}
      </motion.span>
      <motion.div
        className="os-dock-item__icon-wrap"
        style={{ scale }}
        ref={iconRef}
      >
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
  const isCompact = useIsCompactViewport();
  const mouseX = useMotionValue(Infinity);

  // Show only first 4 apps on mobile, all apps on desktop
  const visibleApps = isCompact ? dockApps.slice(0, 4) : dockApps;

  return (
    <nav
      className="os-dock"
      aria-label="Application dock"
      onMouseMove={(e) => {
        if (!isCompact) {
          mouseX.set(e.clientX);
        }
      }}
      onMouseLeave={() => {
        if (!isCompact) {
          mouseX.set(Infinity);
        }
      }}
    >
      {visibleApps.map((app, index) => {
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
            isCompact={isCompact}
          />
        );
      })}
    </nav>
  );
}
