import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  calculateViewportAwarePosition,
  clampWindowPosition,
  getDesktopAreaSize,
} from "./window/geometry";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";

type DesktopWidgetProps = {
  id: string;
  children: ReactNode;
  initialBounds: { x: number; y: number; width: number; height: number };
  zIndex: number;
  onFocus: () => void;
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
  zIndex,
  onFocus,
}: DesktopWidgetProps) {
  const frameRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const boundsRef = useRef(initialBounds);
  const onFocusRef = useRef(onFocus);
  const [bounds, setBounds] = useState(() => {
    const area = getDesktopAreaSize();
    return calculateViewportAwarePosition(initialBounds, area, initialBounds);
  });
  const isCompact = useIsCompactViewport();

  useEffect(() => {
    boundsRef.current = bounds;
    onFocusRef.current = onFocus;
  }, [bounds, onFocus]);

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
      onFocusRef.current();

      dragRef.current = {
        pointerId: pointerEvent.pointerId,
        startX: pointerEvent.clientX,
        startY: pointerEvent.clientY,
        originX: boundsRef.current.x,
        originY: boundsRef.current.y,
        width: boundsRef.current.width,
        height: boundsRef.current.height,
        raf: null,
        latestX: boundsRef.current.x,
        latestY: boundsRef.current.y,
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
  }, [applyTransform]);

  const compactStyle = isCompact
    ? {
        width: "100%",
        height: "100%",
        transform: "translate3d(0px, 0px, 0)",
        zIndex,
      }
    : {
        width: bounds.width,
        height: bounds.height,
        transform: `translate3d(${bounds.x}px, ${bounds.y}px, 0)`,
        zIndex,
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
