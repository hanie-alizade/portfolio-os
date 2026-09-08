/**
 * Design token accessors for future interactive layers.
 * Prefer CSS variables / Tailwind theme tokens in components when possible.
 */
export const osTokens = {
  colors: {
    bg: "var(--os-bg)",
    surface: "var(--os-surface)",
    text: "var(--os-text)",
    textMuted: "var(--os-text-muted)",
    accent: "var(--os-accent)",
    accentStrong: "var(--os-accent-strong)",
    cyan: "var(--os-cyan)",
    danger: "var(--os-danger)",
    terminal: "var(--os-terminal)",
    status: "var(--os-status)",
    border: "var(--os-border)",
  },
  radius: {
    sm: "var(--os-radius-sm)",
    md: "var(--os-radius-md)",
    lg: "var(--os-radius-lg)",
    dock: "var(--os-radius-dock)",
    xl: "var(--os-radius-xl)",
    pill: "var(--os-radius-pill)",
  },
  shadow: {
    sm: "var(--os-shadow-sm)",
    window: "var(--os-shadow-window)",
    dock: "var(--os-shadow-dock)",
    glow: "var(--os-shadow-glow)",
  },
  space: {
    1: "var(--os-space-1)",
    2: "var(--os-space-2)",
    3: "var(--os-space-3)",
    4: "var(--os-space-4)",
    5: "var(--os-space-5)",
    6: "var(--os-space-6)",
    7: "var(--os-space-7)",
    8: "var(--os-space-8)",
  },
  z: {
    desktop: "var(--os-z-desktop)",
    window: "var(--os-z-window)",
    dock: "var(--os-z-dock)",
    menubar: "var(--os-z-menubar)",
    overlay: "var(--os-z-overlay)",
  },
} as const;
