import { NextResponse } from "next/server";

interface ValidateRequestBody {
  challengeId: string;
  reasoningText: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ValidateRequestBody>;
  const reasoningText = (body.reasoningText ?? "").trim();

  if (!reasoningText) {
    return NextResponse.json(
      { error: "Reasoning text is required.", verdict: "insufficient", xpAward: 0 },
      { status: 400 }
    );
  }

  // Very rough heuristic stub: we reward structure, not correctness.
  const lengthScore = Math.min(1, reasoningText.split(/\s+/).length / 120);
  const structureSignals = ["first", "second", "third", "because", "therefore", "if", "then"];
  const structureHits = structureSignals.filter((token) =>
    reasoningText.toLowerCase().includes(token.toLowerCase())
  ).length;

  const structureScore = Math.min(1, structureHits / 4);
  const composite = 0.6 * structureScore + 0.4 * lengthScore;
  const xpAward = Math.round(40 + composite * 60); // 40–100 XP

  let verdict: "insufficient" | "developing" | "solid" | "exceptional" = "insufficient";
  if (composite > 0.8) verdict = "exceptional";
  else if (composite > 0.55) verdict = "solid";
  else if (composite > 0.3) verdict = "developing";

  const feedback =
    verdict === "exceptional"
      ? "Your reasoning shows clear structure and layered consideration of possibilities. Nice work."
      : verdict === "solid"
        ? "Your reasoning is well structured. You could push it further by stress-testing assumptions and edge cases."
        : verdict === "developing"
          ? "You have a starting structure. Try making your steps explicit, and connect each move back to the goal."
          : "Focus on writing out a step-by-step plan before jumping to a conclusion.";

  return NextResponse.json({
    verdict,
    xpAward,
    feedback
  });
}

