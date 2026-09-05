"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  calculateViewportAwarePosition,
  clampWindowPosition,
  getDesktopAreaSize,
} from "./window/geometry";

type DesktopWidgetProps = {
  id: string;
  children: ReactNode;
  initialBounds: { x: number; y: number; width: number; height: number };
};

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
  raf: number | null;
  latestX: number;
  latestY: number;
};

export function DesktopWidget({
  id,
  children,
  initialBounds,
}: DesktopWidgetProps) {
  const frameRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const [bounds, setBounds] = useState(() => {
    if (typeof window === "undefined") return initialBounds;
    const area = getDesktopAreaSize();
    return calculateViewportAwarePosition(initialBounds, area, initialBounds);
  });
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const applyTransform = useCallback((x: number, y: number) => {
    const node = frameRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  useEffect(() => {
    if (dragRef.current || isCompact) {
      applyTransform(0, 0);
      return;
    }
    applyTransform(bounds.x, bounds.y);
  }, [bounds.x, bounds.y, isCompact, applyTransform]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const next = clampWindowPosition(
        {
          x: drag.originX + (event.clientX - drag.startX),
          y: drag.originY + (event.clientY - drag.startY),
          width: drag.width,
          height: drag.height,
        },
        getDesktopAreaSize()
      );

      drag.latestX = next.x;
      drag.latestY = next.y;

      if (drag.raf != null) return;
      drag.raf = window.requestAnimationFrame(() => {
        const active = dragRef.current;
        if (!active) return;
        active.raf = null;
        applyTransform(active.latestX, active.latestY);
      });
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      if (drag.raf != null) {
        window.cancelAnimationFrame(drag.raf);
      }

      const node = frameRef.current;
      node?.classList.remove("os-widget--dragging");
      if (node?.hasPointerCapture(drag.pointerId)) {
        node.releasePointerCapture(drag.pointerId);
      }

      setBounds({
        x: drag.latestX,
        y: drag.latestY,
        width: drag.width,
        height: drag.height,
      });

      dragRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };

    const onPointerDownCapture = (event: Event) => {
      const pointerEvent = event as PointerEvent;
      const target = pointerEvent.target as HTMLElement | null;

      if (!target?.closest(".os-widget")) return;
      if (pointerEvent.button !== 0) return;
      if (target.closest("button")) return;

      const compact = window.matchMedia("(max-width: 767px)").matches;
      if (compact) return;

      pointerEvent.preventDefault();

      dragRef.current = {
        pointerId: pointerEvent.pointerId,
        startX: pointerEvent.clientX,
        startY: pointerEvent.clientY,
        originX: bounds.x,
        originY: bounds.y,
        width: bounds.width,
        height: bounds.height,
        raf: null,
        latestX: bounds.x,
        latestY: bounds.y,
      };

      frameRef.current?.classList.add("os-widget--dragging");
      frameRef.current?.setPointerCapture(pointerEvent.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
    };

    const node = frameRef.current;
    node?.addEventListener("pointerdown", onPointerDownCapture);

    return () => {
      node?.removeEventListener("pointerdown", onPointerDownCapture);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      if (dragRef.current?.raf != null) {
        window.cancelAnimationFrame(dragRef.current.raf);
      }
      dragRef.current = null;
    };
  }, [bounds, applyTransform]);

  const compactStyle = isCompact
    ? {
        width: "100%",
        height: "100%",
        transform: "translate3d(0px, 0px, 0)",
      }
    : {
        width: bounds.width,
        height: bounds.height,
      };

  return (
    <section
      ref={frameRef}
      className={`os-widget${isCompact ? " os-widget--maximized" : ""}`}
      style={compactStyle}
      data-widget-id={id}
    >
      {children}
    </section>
  );
}
