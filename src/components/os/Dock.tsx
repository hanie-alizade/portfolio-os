"use client";

import { useRef, useState, useEffect } from "react";
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

const BASE_SIZE = 44;
const MAX_SIZE = 68;

function DockIcon({
  app,
  mouseX,
  index,
  dockRectRef,
  isRunning,
  isFocused,
  onClick,
}: {
  app: DockApp;
  mouseX: MotionValue<number>;
  index: number;
  dockRectRef: React.RefObject<DOMRect | null>;
  isRunning: boolean;
  isFocused: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Calculate distance without per-icon layout reads
  // Use estimated positions based on dock rect and index
  const distance = useTransform(mouseX, (val) => {
    const rect = dockRectRef.current;
    if (!rect) return Infinity;
    // Estimate icon center based on flex layout: roughly BASE_SIZE + 12px gap per icon
    const estimatedIconCenter =
      rect.left + index * (BASE_SIZE + 12) + BASE_SIZE / 2;
    return val - estimatedIconCenter;
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
  const dockRef = useRef<HTMLElement>(null);
  const dockRectRef = useRef<DOMRect | null>(null);

  // Update dock rect on mount and resize
  useEffect(() => {
    const updateDockRect = () => {
      dockRectRef.current = dockRef.current?.getBoundingClientRect() || null;
    };

    updateDockRect();
    window.addEventListener("resize", updateDockRect);
    return () => window.removeEventListener("resize", updateDockRect);
  }, []);

  return (
    <nav
      ref={dockRef}
      className="os-dock"
      aria-label="Application dock"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        // Single layout read per mouse move, not per icon
        dockRectRef.current = dockRef.current?.getBoundingClientRect() || null;
      }}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        dockRectRef.current = null;
      }}
    >
      {dockApps.map((app, index) => {
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
            index={index}
            dockRectRef={dockRectRef}
            isRunning={isRunning}
            isFocused={isFocused}
            onClick={() => launchApp(app.id)}
          />
        );
      })}
    </nav>
  );
}
