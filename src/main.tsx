import React from "react";
import ReactDOM from "react-dom/client";
import { DesktopShell } from "./components/os/DesktopShell";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./components/os/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DesktopShell />
    </ErrorBoundary>
  </React.StrictMode>
);
