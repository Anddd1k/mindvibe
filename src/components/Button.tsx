import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 text-sm uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-lime focus-visible:ring-offset-2 focus-visible:ring-offset-mv-bg disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "border-mv-lime text-mv-lime hover:bg-mv-lime hover:text-mv-bg",
  ghost: "border-mv-border text-mv-text hover:border-mv-lime hover:text-mv-lime"
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; children: ReactNode }) {
  return (
    <button {...props} className={[base, variants[variant], className].join(" ")}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  children,
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; children: ReactNode }) {
  return (
    <Link {...props} className={[base, variants[variant], className].join(" ")}>
      {children}
    </Link>
  );
}

