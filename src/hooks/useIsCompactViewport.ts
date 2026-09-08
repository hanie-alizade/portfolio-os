"use client";
import { useEffect, useState } from "react";

export function useIsCompactViewport() {
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsCompact(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return isCompact;
}
