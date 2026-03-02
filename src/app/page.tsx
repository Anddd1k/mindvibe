import { Badge } from "@/components/Badge";
import { ButtonLink } from "@/components/Button";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Badge>MindVibe</Badge>
        <h1 className="text-3xl uppercase tracking-[0.25em] text-mv-lime">Think sharper.</h1>
        <p className="max-w-2xl text-sm leading-6 text-mv-muted">
          Daily logic puzzles, ethical dilemmas, and creative tasks. Earn XP, build streaks, climb the weekly
          leaderboard.
        </p>
      </div>

      <div className="grid gap-4 border border-mv-border bg-mv-panel p-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-mv-muted">Today</div>
          <div className="text-lg uppercase tracking-wider">Daily challenge</div>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-mv-muted">Progress</div>
          <div className="text-lg uppercase tracking-wider">Level 1 • 0 XP</div>
        </div>
        <div className="flex items-center md:justify-end">
          <ButtonLink href="/challenge/daily">Enter</ButtonLink>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-mv-border bg-mv-panel p-6">
          <div className="text-xs uppercase tracking-widest text-mv-muted">Streak</div>
          <div className="mt-2 text-2xl tracking-[0.2em] text-mv-lime">0</div>
          <div className="mt-2 text-sm text-mv-muted">7-day streak tracking lands next.</div>
        </div>
        <div className="border border-mv-border bg-mv-panel p-6">
          <div className="text-xs uppercase tracking-widest text-mv-muted">Leaderboard</div>
          <div className="mt-2 text-2xl tracking-[0.2em] text-mv-lime">—</div>
          <div className="mt-2 text-sm text-mv-muted">Weekly leaderboard lands next.</div>
        </div>
      </div>
    </div>
  );
}

