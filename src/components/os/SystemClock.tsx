"use client";

import { useEffect, useState } from "react";

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function SystemClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time
      className="inline-block min-w-[9.5rem] text-right tabular-nums text-os-xs text-os-text-muted"
      dateTime={now?.toISOString()}
      suppressHydrationWarning
    >
      {now ? formatClock(now) : "\u00A0"}
    </time>
  );
}
