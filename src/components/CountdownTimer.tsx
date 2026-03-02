"use client";

import { useEffect, useMemo, useState } from "react";

function getNextLocalMidnight(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next;
}

function formatTwo(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function CountdownTimer({
  label = "Resets in",
  targetDate
}: {
  label?: string;
  targetDate?: Date;
}) {
  const target = useMemo(() => targetDate ?? getNextLocalMidnight(), [targetDate]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="flex items-center justify-between gap-4 border border-mv-border bg-mv-panel px-4 py-3">
      <div className="text-xs uppercase tracking-widest text-mv-muted">{label}</div>
      <div className="text-sm tracking-[0.25em] text-mv-lime">
        {formatTwo(hours)}:{formatTwo(minutes)}:{formatTwo(seconds)}
      </div>
    </div>
  );
}

