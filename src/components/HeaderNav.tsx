"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonLink } from "@/components/Button";

export function HeaderNav() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  if (loading) {
    return (
      <nav className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-mv-muted">...</span>
      </nav>
    );
  }

  if (user) {
    return (
      <nav className="flex items-center gap-2">
        <ButtonLink href="/leaderboard" variant="ghost">
          Leaderboard
        </ButtonLink>
        <ButtonLink href="/challenge/daily" variant="ghost">
          Daily
        </ButtonLink>
        <span className="border-l border-mv-border pl-2 text-xs uppercase tracking-widest text-mv-muted">
          {user.email ?? user.id.slice(0, 8)}
        </span>
        <button
            type="button"
            onClick={handleSignOut}
            className="text-xs uppercase tracking-widest text-mv-muted hover:text-mv-lime"
          >
            Sign out
          </button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2">
      <ButtonLink href="/leaderboard" variant="ghost">
        Leaderboard
      </ButtonLink>
      <ButtonLink href="/challenge/daily" variant="ghost">
        Daily
      </ButtonLink>
      <Link
        href="/auth/login"
        className="border border-mv-lime px-4 py-2 text-sm uppercase tracking-wider text-mv-lime hover:bg-mv-lime hover:text-mv-bg"
      >
        Log in
      </Link>
    </nav>
  );
}
