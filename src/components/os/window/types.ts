import type { DockAppId } from "@/components/os/appIds";

export type WindowId = string;

export type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WindowChrome = "default" | "sticky" | "widget";

export type ManagedWindow = {
  id: WindowId;
  appId?: DockAppId;
  title: string;
  bounds: WindowBounds;
  restoreBounds: WindowBounds | null;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  chrome: WindowChrome;
};

export type WindowManagerSnapshot = {
  windows: Record<WindowId, ManagedWindow>;
  windowOrder: WindowId[];
  focusedId: WindowId | null;
  topZ: number;
  pendingPayloads: Partial<Record<WindowId, unknown>>;
};

export type CreateWindowInput = {
  id: WindowId;
  title: string;
  appId?: DockAppId;
  bounds: WindowBounds;
  isOpen?: boolean;
  isMinimized?: boolean;
  isMaximized?: boolean;
  chrome?: WindowChrome;
};
