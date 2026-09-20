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

  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const managedRef = useRef(managed);
  const setBoundsRef = useRef(setWindowBounds);

  const isCompact = useIsCompactViewport();
  const isFocused = state.focusedId === managed.id;
  const canDrag =
    !isCompact && !managed.isMaximized && managed.chrome !== "widget";

  const [animationState, setAnimationState] = useState<
    | "entering"
    | "exiting"
    | "minimizing"
    | "restoring"
    | "maximizing"
    | "restoring-from-maximize"
    | null
  >("entering");
  const prevManagedRef = useRef(managed);
  const hasClearedInitialAnimation = useRef(false);

  useEffect(() => {
    setBoundsRef.current = setWindowBounds;
    managedRef.current = managed;
  }, [setWindowBounds, managed]);

  // Clear initial entering animation after mount
  useEffect(() => {
    if (!hasClearedInitialAnimation.current) {
      hasClearedInitialAnimation.current = true;
      const timer = setTimeout(() => setAnimationState(null), 200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle window entering/exiting/minimizing/restoring animations
  useEffect(() => {
    const prev = prevManagedRef.current;
    prevManagedRef.current = managed;

    // Window just restored from minimized state
    if (
      managed.isOpen &&
      !managed.isMinimized &&
      prev.isMinimized &&
      animationState === null
    ) {
      setAnimationState("restoring");
      const timer = setTimeout(() => setAnimationState(null), 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managed.isOpen, managed.isMinimized, animationState]);

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
      node?.classList.remove("os-window__positioning--dragging");
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

      const node = frameRef.current;
      node?.classList.add("os-window__positioning--dragging");
      node?.setPointerCapture(pointerEvent.pointerId);
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

  const handleClose = () => {
    setAnimationState("exiting");
    setTimeout(() => {
      closeWindow(managed.id);
      setAnimationState(null);
    }, 150);
  };

  const handleMinimize = () => {
    setAnimationState("minimizing");
    setTimeout(() => {
      minimizeWindow(managed.id);
      setAnimationState(null);
    }, 180);
  };

  const handleMaximize = () => {
    if (managed.isMaximized) {
      setAnimationState("restoring-from-maximize");
      setTimeout(() => {
        toggleMaximize(managed.id);
        setTimeout(() => setAnimationState(null), 120);
      }, 16);
    } else {
      setAnimationState("maximizing");
      setTimeout(() => {
        toggleMaximize(managed.id);
        setTimeout(() => setAnimationState(null), 120);
      }, 16);
    }
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
    <div
      ref={frameRef}
      className="os-window__positioning"
      style={{
        zIndex: managed.zIndex,
        ...compactStyle,
      }}
      aria-label={managed.title}
      data-window-id={managed.id}
      onPointerDown={() => focusWindow(managed.id)}
    >
      <section
        className={`os-window os-window--${managed.chrome}${
          isFocused ? " os-window--focused" : ""
        }${isCompact || managed.isMaximized ? " os-window--maximized" : ""}${
          animationState ? ` os-window--${animationState}` : ""
        }`}
      >
        {managed.chrome !== "widget" ? (
          <div
            className={`os-window__titlebar${
              canDrag ? " os-window__titlebar--draggable" : ""
            }`}
            style={{ height: TITLEBAR_HEIGHT }}
            onPointerDown={onTitlePointerDown}
            onDoubleClick={() => {
              if (!isCompact) handleMaximize();
            }}
          >
            {isCompact ? (
              <button
                type="button"
                className="os-window__back"
                aria-label={`Close ${managed.title}`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClose();
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            ) : (
              <>
                <div
                  className="os-window__controls"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="os-window__control os-window__control--close"
                    aria-label={`Close ${managed.title}`}
                    onClick={() => handleClose()}
                  />
                  <button
                    type="button"
                    className="os-window__control os-window__control--minimize"
                    aria-label={`Minimize ${managed.title}`}
                    onClick={() => handleMinimize()}
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
                      if (!isCompact) handleMaximize();
                    }}
                  />
                </div>
                <h2 className="os-window__title">{managed.title}</h2>
                <span
                  className="os-window__titlebar-spacer"
                  aria-hidden="true"
                />
              </>
            )}
          </div>
        ) : null}
        <div className="os-window__body">{children}</div>
      </section>
    </div>
  );
}
