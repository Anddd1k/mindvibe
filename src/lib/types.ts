export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DbUser {
  id: string;
  created_at: string;
  username: string | null;
  xp: number;
  level: UserLevel;
  current_streak_days: number;
  longest_streak_days: number;
}

export type ChallengeType = "logic" | "ethical" | "creative";

export interface DbChallenge {
  id: string;
  created_at: string;
  title: string;
  prompt: string;
  type: ChallengeType;
  difficulty: "light" | "moderate" | "deep";
  active_on: string; // date-only string (YYYY-MM-DD) for daily rotation
}

export interface DbSubmission {
  id: string;
  created_at: string;
  user_id: string;
  challenge_id: string;
  reasoning: string;
  ai_score: number | null;
  ai_verdict: string | null;
  xp_awarded: number | null;
}

export interface DbWeeklyLeaderboardRow {
  user_id: string;
  username: string | null;
  week_start: string;
  weekly_xp: number;
  rank: number;
}

