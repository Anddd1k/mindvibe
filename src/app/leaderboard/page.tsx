import { Badge } from "@/components/Badge";

const MOCK_LEADERBOARD = [
  { rank: 1, username: "axiom", level: 7, weeklyXp: 820 },
  { rank: 2, username: "paradox", level: 6, weeklyXp: 740 },
  { rank: 3, username: "syllogism", level: 5, weeklyXp: 680 },
  { rank: 4, username: "dialectic", level: 5, weeklyXp: 610 },
  { rank: 5, username: "heuristic", level: 4, weeklyXp: 540 }
] as const;

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge>Weekly leaderboard</Badge>
        <h1 className="text-2xl uppercase tracking-[0.25em] text-mv-lime">Signal over noise.</h1>
        <p className="max-w-xl text-sm text-mv-muted">
          Rankings reset every week. XP comes from well-structured reasoning on daily challenges, not speed-running
          answers.
        </p>
      </div>

      <section className="border border-mv-border bg-mv-panel">
        <div className="grid grid-cols-4 border-b border-mv-border px-4 py-3 text-[11px] uppercase tracking-widest text-mv-muted">
          <span>#</span>
          <span>User</span>
          <span className="text-right">Level</span>
          <span className="text-right">Weekly XP</span>
        </div>
        <ul className="divide-y divide-mv-border">
          {MOCK_LEADERBOARD.map((row) => (
            <li
              key={row.rank}
              className="grid grid-cols-4 px-4 py-3 text-sm hover:bg-black/40"
            >
              <span className="text-mv-muted">{String(row.rank).padStart(2, "0")}</span>
              <span className="truncate">{row.username}</span>
              <span className="text-right text-mv-muted">{row.level}</span>
              <span className="text-right text-mv-lime">{row.weeklyXp}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[11px] uppercase tracking-widest text-mv-muted">
        This board will sync with the Supabase `leaderboard` view once auth + persistence are wired.
      </p>
    </div>
  );
}

