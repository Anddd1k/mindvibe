import { type ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-mv-border bg-mv-panel px-2 py-1 text-[11px] uppercase tracking-widest text-mv-muted">
      {children}
    </span>
  );
}

