import type {
  CreateWindowInput,
  ManagedWindow,
  WindowBounds,
  WindowId,
} from "./types";

export const TITLEBAR_HEIGHT = 36;
export const MIN_VISIBLE_EDGE = 72;
export const EDGE_MARGIN = 8;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getDesktopAreaSize() {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return { width: 1920, height: 1080 };
  }

  const area = document.getElementById("desktop-area");
  if (!area) {
    return {
      width: window.innerWidth,
      height: Math.max(window.innerHeight - 60, 240),
    };
  }

  return {
    width: area.clientWidth,
    height: area.clientHeight,
  };
}

export function clampWindowPosition(
  bounds: WindowBounds,
  area = getDesktopAreaSize()
): WindowBounds {
  const maxX = Math.max(area.width - MIN_VISIBLE_EDGE, 0);
  const minX = Math.min(0, area.width - bounds.width);
  const maxY = Math.max(area.height - TITLEBAR_HEIGHT, 0);

  return {
    ...bounds,
    x: clamp(bounds.x, minX, maxX),
    y: clamp(bounds.y, 0, maxY),
  };
}

export function createManagedWindow(
  input: CreateWindowInput,
  zIndex: number
): ManagedWindow {
  return {
    id: input.id,
    appId: input.appId,
    title: input.title,
    bounds: input.bounds,
    restoreBounds: null,
    zIndex,
    isOpen: input.isOpen ?? true,
    isMinimized: input.isMinimized ?? false,
    isMaximized: input.isMaximized ?? false,
    chrome: input.chrome ?? "default",
  };
}

export function maximizedBounds(area = getDesktopAreaSize()): WindowBounds {
  return {
    x: 0,
    y: 0,
    width: Math.max(area.width, 280),
    height: Math.max(area.height, 200),
  };
}

export function isCompactViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function findWindowIdByApp(
  windows: Record<WindowId, ManagedWindow>,
  appId: string
): WindowId | null {
  for (const window of Object.values(windows)) {
    if (window.appId === appId) return window.id;
  }
  return null;
}

export function calculateViewportAwarePosition(
  bounds: WindowBounds,
  area: { width: number; height: number },
  referenceBounds: WindowBounds
): WindowBounds {
  const { x, y, width, height } = bounds;

  // Start with the configured bounds
  let adjustedX = x;
  let adjustedY = y;

  // Horizontal fitting: only move left if the window would extend beyond right edge
  const rightEdge = x + width;
  if (rightEdge > area.width) {
    // Move left only as much as necessary to fit, preserving edge margin
    adjustedX = Math.max(EDGE_MARGIN, area.width - width - EDGE_MARGIN);
  }

  // Vertical fitting: only move up if the window would extend beyond bottom edge
  const bottomEdge = y + height;
  if (bottomEdge > area.height) {
    console.log({
      bottomEdge,
      final: area.height - height - EDGE_MARGIN,
      area,
      bounds,
    });
    // Move up only as much as necessary to fit, preserving edge margin
    adjustedY = Math.max(EDGE_MARGIN, area.height - height - EDGE_MARGIN);
  }

  // Apply clamping to ensure window remains accessible
  const clamped = clampWindowPosition(
    { ...bounds, x: adjustedX, y: adjustedY },
    area
  );

  return clamped;
}

export function getReferenceCompositionBounds(
  windows: CreateWindowInput[]
): WindowBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const window of windows) {
    minX = Math.min(minX, window.bounds.x);
    minY = Math.min(minY, window.bounds.y);
    maxX = Math.max(maxX, window.bounds.x + window.bounds.width);
    maxY = Math.max(maxY, window.bounds.y + window.bounds.height);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
