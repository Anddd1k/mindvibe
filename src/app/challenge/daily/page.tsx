"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { CountdownTimer } from "@/components/CountdownTimer";

const MOCK_DAILY_CHALLENGE = {
  id: "demo-logic-001",
  type: "logic",
  title: "The Silent Elevator",
  prompt:
    "You enter an old elevator with four numbered buttons (1–4) but no floor labels. The building has four floors: lobby, library, lab, and loft. You start in the lobby. You can press at most two buttons before the system locks for 24 hours. How can you deduce which button leads to the lab using only where the elevator moves and the number of stops?",
  difficulty: "moderate"
} as const;

const FIRST_HINT_COST = 20;
const SECOND_HINT_COST = 30;
const MAX_LEVEL = 10;
const XP_PER_LEVEL = 100;

type Verdict = "insufficient" | "developing" | "solid" | "exceptional";

interface ValidationResult {
  verdict: Verdict;
  xpAward: number;
  feedback: string;
}

export default function DailyChallengePage() {
  const [reasoning, setReasoning] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [xp, setXp] = useState(0);
  const [streakDays] = useState(0); // wire to Supabase later
  const [firstHintUnlocked, setFirstHintUnlocked] = useState(false);
  const [secondHintUnlocked, setSecondHintUnlocked] = useState(false);

  const level = Math.min(MAX_LEVEL, 1 + Math.floor(xp / XP_PER_LEVEL));
  const currentLevelFloorXp = (level - 1) * XP_PER_LEVEL;
  const progressWithinLevel = xp - currentLevelFloorXp;
  const xpToNext = level === MAX_LEVEL ? 0 : XP_PER_LEVEL - progressWithinLevel;

  const canAffordFirstHint = !firstHintUnlocked && xp >= FIRST_HINT_COST;
  const canAffordSecondHint = firstHintUnlocked && !secondHintUnlocked && xp >= SECOND_HINT_COST;

  async function handleSubmit() {
    setError(null);
    setValidation(null);

    if (!reasoning.trim()) {
      setError("Write at least a short paragraph of reasoning first.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: MOCK_DAILY_CHALLENGE.id,
          reasoningText: reasoning
        })
      });

      const data = (await res.json()) as ValidationResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Validation failed. Try again.");
        return;
      }

      setValidation({
        verdict: data.verdict,
        xpAward: data.xpAward,
        feedback: data.feedback
      });
      setXp((prev) => prev + (data.xpAward ?? 0));
    } catch (e) {
      setError("Network issue while talking to the validator.");
    } finally {
      setSubmitting(false);
    }
  }

  function spendXp(cost: number) {
    setXp((prev) => Math.max(0, prev - cost));
  }

  function handleUnlockFirstHint() {
    if (!canAffordFirstHint) return;
    spendXp(FIRST_HINT_COST);
    setFirstHintUnlocked(true);
  }

  function handleUnlockSecondHint() {
    if (!canAffordSecondHint) return;
    spendXp(SECOND_HINT_COST);
    setSecondHintUnlocked(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge>Daily challenge</Badge>
          <h1 className="text-2xl uppercase tracking-[0.25em] text-mv-lime">MindVibe // 001</h1>
        </div>
        <div className="w-full max-w-xs">
          <CountdownTimer />
        </div>
      </div>

      <section className="space-y-4 border border-mv-border bg-mv-panel p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-mv-muted">
          <span>{MOCK_DAILY_CHALLENGE.type}</span>
          <span>Difficulty: {MOCK_DAILY_CHALLENGE.difficulty}</span>
        </div>
        <h2 className="text-lg uppercase tracking-wider">{MOCK_DAILY_CHALLENGE.title}</h2>
        <p className="text-sm leading-6 text-mv-muted">{MOCK_DAILY_CHALLENGE.prompt}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <label className="space-y-2 text-xs uppercase tracking-widest text-mv-muted">
            <span>Your reasoning</span>
            <textarea
              className="min-h-[160px] w-full border border-mv-border bg-transparent p-3 text-xs tracking-tightish text-mv-text outline-none focus:border-mv-lime"
              placeholder="Write how you would approach and solve this. Focus on structure, not just the final answer."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Checking..." : "Submit for XP check"}
            </Button>
            <span className="text-[11px] uppercase tracking-widest text-mv-muted">
              AI only validates structure. No answers revealed.
            </span>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {validation && (
            <div className="space-y-2 border border-mv-border bg-mv-panel p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <span className="text-mv-muted">Validation result</span>
                <span className="text-mv-lime">{validation.verdict}</span>
              </div>
              <p className="text-xs text-mv-muted">{validation.feedback}</p>
              <p className="text-xs text-mv-lime uppercase tracking-widest">
                +{validation.xpAward} XP (applied to this session only)
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4 md:col-span-2">
          <div className="space-y-3 border border-mv-border bg-mv-panel p-4">
            <div className="text-xs uppercase tracking-widest text-mv-muted">Session</div>
            <div className="space-y-1 text-sm">
              <div>
                Level {level}{" "}
                <span className="text-[11px] uppercase tracking-widest text-mv-muted">
                  {streakDays} day streak
                </span>
              </div>
              <div className="text-mv-muted">
                {xp} XP {level === MAX_LEVEL ? "(max level)" : `• ${xpToNext} XP to Level ${level + 1}`}
              </div>
            </div>
          </div>

          <div className="space-y-3 border border-mv-border bg-mv-panel p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-mv-muted">
              <span>Hint system</span>
              <span>Costs XP</span>
            </div>
            <p className="text-xs text-mv-muted">
              Hints are structured nudges, not spoilers. Each hint subtracts XP from your reward for this challenge.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                disabled={!canAffordFirstHint}
                onClick={handleUnlockFirstHint}
              >
                {firstHintUnlocked ? "First hint unlocked" : `First hint (−${FIRST_HINT_COST} XP)`}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                disabled={!canAffordSecondHint}
                onClick={handleUnlockSecondHint}
              >
                {secondHintUnlocked ? "Deeper hint unlocked" : `Deeper hint (−${SECOND_HINT_COST} XP)`}
              </Button>
            </div>
            <div className="space-y-2 text-xs text-mv-muted">
              {firstHintUnlocked && (
                <p>
                  Hint 1: Think of patterns of stops you can trigger that reveal how buttons map to floors, even without
                  labels.
                </p>
              )}
              {secondHintUnlocked && (
                <p>
                  Hint 2: Design a sequence where the number of moves and direction changes uniquely identify the lab,
                  even if you do not reach it on the first try.
                </p>
              )}
            </div>
            <p className="text-[11px] uppercase tracking-widest text-mv-muted">
              XP + streak will sync with Supabase user records.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}


