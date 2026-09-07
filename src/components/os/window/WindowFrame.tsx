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
  clampWindowPosition,
  getDesktopAreaSize,
  TITLEBAR_HEIGHT,
} from "./geometry";
import type { ManagedWindow } from "./types";
import { useWindowManager } from "./WindowManagerContext";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";

type WindowFrameProps = {
  window: ManagedWindow;
  children: ReactNode;
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

export function WindowFrame({ window: managed, children }: WindowFrameProps) {
  const {
    state,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    setWindowBounds,
  } = useWindowManager();

  const frameRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const managedRef = useRef(managed);
  const setBoundsRef = useRef(setWindowBounds);

  const isCompact = useIsCompactViewport();
  const isFocused = state.focusedId === managed.id;
  const canDrag =
    !isCompact && !managed.isMaximized && managed.chrome !== "widget";
  const canDragWidget =
    !isCompact && !managed.isMaximized && managed.chrome === "widget";

  useEffect(() => {
    managedRef.current = managed;
    setBoundsRef.current = setWindowBounds;
  }, [managed, setWindowBounds]);

  const applyTransform = useCallback((x: number, y: number) => {
    const node = frameRef.current;
    if (!node) return;
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  useEffect(() => {
    if (dragRef.current) return;
    if (managed.isMaximized || isCompact) {
      applyTransform(0, 0);
      return;
    }
    applyTransform(managed.bounds.x, managed.bounds.y);
  }, [
    managed.bounds.x,
    managed.bounds.y,
    managed.isMaximized,
    isCompact,
    applyTransform,
  ]);

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
      node?.classList.remove("os-window--dragging");
      if (node?.hasPointerCapture(drag.pointerId)) {
        node.releasePointerCapture(drag.pointerId);
      }

      setBoundsRef.current(managedRef.current.id, {
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
      const isWidget = managedRef.current.chrome === "widget";

      if (!isWidget && !target?.closest(".os-window__titlebar")) return;
      if (isWidget && !target?.closest(".os-window")) return;
      if (pointerEvent.button !== 0) return;
      if (target?.closest("button")) return;

      const current = managedRef.current;
      const compact = window.matchMedia("(max-width: 767px)").matches;
      if (compact || current.isMaximized) return;

      pointerEvent.preventDefault();

      dragRef.current = {
        pointerId: pointerEvent.pointerId,
        startX: pointerEvent.clientX,
        startY: pointerEvent.clientY,
        originX: current.bounds.x,
        originY: current.bounds.y,
        width: current.bounds.width,
        height: current.bounds.height,
        raf: null,
        latestX: current.bounds.x,
        latestY: current.bounds.y,
      };

      frameRef.current?.classList.add("os-window--dragging");
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

  const onTitlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    focusWindow(managed.id);
  };

  const compactStyle =
    isCompact || managed.isMaximized
      ? {
          width: "100%",
          height: "100%",
          transform: "translate3d(0px, 0px, 0)",
        }
      : {
          width: managed.bounds.width,
          height: managed.bounds.height,
          transform: `translate3d(${managed.bounds.x}px, ${managed.bounds.y}px, 0)`,
        };

  return (
    <section
      ref={frameRef}
      className={`os-window os-window--${managed.chrome}${
        isFocused ? " os-window--focused" : ""
      }${isCompact || managed.isMaximized ? " os-window--maximized" : ""}`}
      style={{
        zIndex: managed.zIndex,
        ...compactStyle,
      }}
      aria-label={managed.title}
      data-window-id={managed.id}
      onPointerDown={() => focusWindow(managed.id)}
    >
      {managed.chrome !== "widget" ? (
        <div
          className={`os-window__titlebar${
            canDrag ? " os-window__titlebar--draggable" : ""
          }`}
          style={{ height: TITLEBAR_HEIGHT }}
          onPointerDown={onTitlePointerDown}
          onDoubleClick={() => {
            if (!isCompact) toggleMaximize(managed.id);
          }}
        >
          <div
            className="os-window__controls"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="os-window__control os-window__control--close"
              aria-label={`Close ${managed.title}`}
              onClick={() => closeWindow(managed.id)}
            />
            <button
              type="button"
              className="os-window__control os-window__control--minimize"
              aria-label={`Minimize ${managed.title}`}
              onClick={() => minimizeWindow(managed.id)}
            />
            <button
              type="button"
              className="os-window__control os-window__control--maximize"
              aria-label={
                managed.isMaximized
                  ? `Restore ${managed.title}`
                  : `Maximize ${managed.title}`
              }
              onClick={() => {
                if (!isCompact) toggleMaximize(managed.id);
              }}
            />
          </div>
          <h2 className="os-window__title">{managed.title}</h2>
          <span className="os-window__titlebar-spacer" aria-hidden="true" />
        </div>
      ) : null}
      <div className="os-window__body">{children}</div>
      {isCompact && (
        <button
          type="button"
          className="os-window__home-indicator"
          aria-label="Back to Home Screen"
          onClick={() => minimizeWindow(managed.id)}
        >
          <span className="os-window__home-indicator-bar" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
