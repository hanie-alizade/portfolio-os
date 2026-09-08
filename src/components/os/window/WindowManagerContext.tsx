"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { DockAppId } from "@/components/os/appIds";
import {
  calculateViewportAwarePosition,
  clampWindowPosition,
  createManagedWindow,
  findWindowIdByApp,
  getDesktopAreaSize,
  getReferenceCompositionBounds,
  isCompactViewport,
  maximizedBounds,
} from "./geometry";
import { INITIAL_WINDOWS } from "./initialWindows";
import type {
  CreateWindowInput,
  ManagedWindow,
  WindowBounds,
  WindowId,
  WindowManagerSnapshot,
} from "./types";

type Action =
  | { type: "FOCUS"; id: WindowId }
  | { type: "CLOSE"; id: WindowId }
  | { type: "MINIMIZE"; id: WindowId }
  | { type: "RESTORE"; id: WindowId }
  | { type: "TOGGLE_MAXIMIZE"; id: WindowId }
  | { type: "SET_BOUNDS"; id: WindowId; bounds: WindowBounds }
  | { type: "OPEN"; id: WindowId }
  | { type: "LAUNCH_APP"; appId: DockAppId }
  | { type: "SET_PAYLOAD"; id: WindowId; payload: unknown }
  | { type: "CLEAR_PAYLOAD"; id: WindowId };

function buildInitialState(inputs: CreateWindowInput[]): WindowManagerSnapshot {
  const windows: Record<WindowId, ManagedWindow> = {};
  const windowOrder: WindowId[] = [];
  let topZ = 10;
  let focusedId: WindowId | null = null;
  const pendingPayloads: Partial<Record<WindowId, unknown>> = {};

  const isSSR =
    typeof document === "undefined" || typeof window === "undefined";

  for (const input of inputs) {
    topZ += 1;
    const bounds = isSSR
      ? input.bounds
      : (() => {
          const referenceBounds = getReferenceCompositionBounds(inputs);
          const desktopArea = getDesktopAreaSize();
          return calculateViewportAwarePosition(
            input.bounds,
            desktopArea,
            referenceBounds
          );
        })();
    windows[input.id] = createManagedWindow({ ...input, bounds }, topZ);
    windowOrder.push(input.id);
    if (input.isOpen !== false && !input.isMinimized) {
      focusedId = input.id;
    }
  }

  return { windows, windowOrder, focusedId, topZ, pendingPayloads };
}

function focusWindowState(
  state: WindowManagerSnapshot,
  id: WindowId
): WindowManagerSnapshot {
  const current = state.windows[id];
  if (!current || !current.isOpen) return state;

  const topZ = state.topZ + 1;
  return {
    ...state,
    focusedId: id,
    topZ,
    windows: {
      ...state.windows,
      [id]: {
        ...current,
        isMinimized: false,
        zIndex: topZ,
      },
    },
  };
}

function reducer(
  state: WindowManagerSnapshot,
  action: Action
): WindowManagerSnapshot {
  switch (action.type) {
    case "FOCUS":
      return focusWindowState(state, action.id);

    case "CLOSE": {
      const current = state.windows[action.id];
      if (!current || !current.isOpen) return state;

      const windows = {
        ...state.windows,
        [action.id]: {
          ...current,
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          restoreBounds: null,
        },
      };

      const focusedId =
        state.focusedId === action.id
          ? Object.values(windows)
              .filter((window) => window.isOpen && !window.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : state.focusedId;

      return { ...state, windows, focusedId };
    }

    case "MINIMIZE": {
      const current = state.windows[action.id];
      if (!current || !current.isOpen || current.isMinimized) return state;

      const windows = {
        ...state.windows,
        [action.id]: { ...current, isMinimized: true },
      };

      const focusedId =
        state.focusedId === action.id
          ? Object.values(windows)
              .filter((window) => window.isOpen && !window.isMinimized)
              .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
          : state.focusedId;

      return { ...state, windows, focusedId };
    }

    case "RESTORE": {
      return focusWindowState(state, action.id);
    }

    case "TOGGLE_MAXIMIZE": {
      const current = state.windows[action.id];
      if (!current || !current.isOpen) return state;

      const topZ = state.topZ + 1;

      if (current.isMaximized) {
        const restored = clampWindowPosition(
          current.restoreBounds ?? current.bounds
        );
        return {
          ...state,
          focusedId: action.id,
          topZ,
          windows: {
            ...state.windows,
            [action.id]: {
              ...current,
              isMinimized: false,
              isMaximized: false,
              bounds: restored,
              restoreBounds: null,
              zIndex: topZ,
            },
          },
        };
      }

      return {
        ...state,
        focusedId: action.id,
        topZ,
        windows: {
          ...state.windows,
          [action.id]: {
            ...current,
            isMinimized: false,
            isMaximized: true,
            restoreBounds: current.bounds,
            bounds: maximizedBounds(),
            zIndex: topZ,
          },
        },
      };
    }

    case "SET_BOUNDS": {
      const current = state.windows[action.id];
      if (!current || !current.isOpen || current.isMaximized) return state;

      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...current,
            bounds: clampWindowPosition(action.bounds),
          },
        },
      };
    }

    case "OPEN": {
      const current = state.windows[action.id];
      if (!current) return state;
      if (current.isOpen && !current.isMinimized) {
        return focusWindowState(state, action.id);
      }

      const topZ = state.topZ + 1;
      const compact = typeof window !== "undefined" && isCompactViewport();

      return {
        ...state,
        focusedId: action.id,
        topZ,
        windows: {
          ...state.windows,
          [action.id]: {
            ...current,
            isOpen: true,
            isMinimized: false,
            isMaximized: compact ? true : current.isMaximized,
            bounds: compact ? maximizedBounds() : current.bounds,
            restoreBounds: compact ? current.bounds : current.restoreBounds,
            zIndex: topZ,
          },
        },
      };
    }

    case "LAUNCH_APP": {
      const id = findWindowIdByApp(state.windows, action.appId);
      if (!id) return state;
      return reducer(state, { type: "OPEN", id });
    }

    case "SET_PAYLOAD": {
      return {
        ...state,
        pendingPayloads: {
          ...state.pendingPayloads,
          [action.id]: action.payload,
        },
      };
    }

    case "CLEAR_PAYLOAD": {
      const { [action.id]: _, ...rest } = state.pendingPayloads;
      return {
        ...state,
        pendingPayloads: rest,
      };
    }

    default:
      return state;
  }
}

type WindowManagerApi = {
  state: WindowManagerSnapshot;
  focusWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  setWindowBounds: (id: WindowId, bounds: WindowBounds) => void;
  openWindow: (id: WindowId, payload?: unknown) => void;
  launchApp: (appId: DockAppId) => void;
  getWindowByAppId: (appId: DockAppId) => ManagedWindow | null;
  dispatch: React.Dispatch<Action>;
};

const WindowManagerContext = createContext<WindowManagerApi | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    INITIAL_WINDOWS,
    buildInitialState
  );

  const hasInitializedPositions = useRef(false);

  useEffect(() => {
    if (hasInitializedPositions.current) return;
    hasInitializedPositions.current = true;

    const referenceBounds = getReferenceCompositionBounds(INITIAL_WINDOWS);
    const desktopArea = getDesktopAreaSize();

    INITIAL_WINDOWS.forEach((window) => {
      const viewportAwareBounds = calculateViewportAwarePosition(
        window.bounds,
        desktopArea,
        referenceBounds
      );
      dispatch({
        type: "SET_BOUNDS",
        id: window.id,
        bounds: viewportAwareBounds,
      });
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    dispatch({ type: "FOCUS", id });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    dispatch({ type: "CLOSE", id });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    dispatch({ type: "MINIMIZE", id });
  }, []);

  const restoreWindow = useCallback((id: WindowId) => {
    dispatch({ type: "RESTORE", id });
  }, []);

  const toggleMaximize = useCallback((id: WindowId) => {
    dispatch({ type: "TOGGLE_MAXIMIZE", id });
  }, []);

  const setWindowBounds = useCallback((id: WindowId, bounds: WindowBounds) => {
    dispatch({ type: "SET_BOUNDS", id, bounds });
  }, []);

  const openWindow = useCallback((id: WindowId, payload?: unknown) => {
    if (payload !== undefined) {
      dispatch({ type: "SET_PAYLOAD", id, payload });
    }
    dispatch({ type: "OPEN", id });
  }, []);

  const launchApp = useCallback((appId: DockAppId) => {
    dispatch({ type: "LAUNCH_APP", appId });
  }, []);

  const getWindowByAppId = useCallback(
    (appId: DockAppId) => {
      const id = findWindowIdByApp(state.windows, appId);
      return id ? state.windows[id] : null;
    },
    [state.windows]
  );

  const api = useMemo<WindowManagerApi>(
    () => ({
      state,
      focusWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      setWindowBounds,
      openWindow,
      launchApp,
      getWindowByAppId,
      dispatch,
    }),
    [
      state,
      focusWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      setWindowBounds,
      openWindow,
      launchApp,
      getWindowByAppId,
      dispatch,
    ]
  );

  return (
    <WindowManagerContext.Provider value={api}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within WindowManagerProvider"
    );
  }
  return context;
}

export function useWindowPayload<T>(id: WindowId): T | undefined {
  const { state, dispatch } = useWindowManager();
  const payload = state.pendingPayloads[id] as T | undefined;

  useEffect(() => {
    if (payload !== undefined) {
      dispatch({ type: "CLEAR_PAYLOAD", id });
    }
  }, [payload, id, dispatch]);

  return payload;
}
