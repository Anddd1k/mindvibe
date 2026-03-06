import { redirect } from "next/navigation";

export default function LegacyLoginRedirectPage() {
  redirect("/auth/login");
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        });
        if (err) throw err;
        setMessage("Check your email for the confirmation link.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (err) throw err;
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (err) throw err;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm space-y-8">
        <div className="space-y-2">
          <Badge>MindVibe</Badge>
          <h1 className="text-2xl uppercase tracking-[0.25em] text-mv-lime">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </h1>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-mv-muted">
            <span className="h-px flex-1 bg-mv-border" />
            <span>or</span>
            <span className="h-px flex-1 bg-mv-border" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <label className="block space-y-2 text-xs uppercase tracking-widest text-mv-muted">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-mv-border bg-transparent px-3 py-2 text-sm text-mv-text outline-none focus:border-mv-lime"
                placeholder="you@example.com"
              />
            </label>
            <label className="block space-y-2 text-xs uppercase tracking-widest text-mv-muted">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-mv-border bg-transparent px-3 py-2 text-sm text-mv-text outline-none focus:border-mv-lime"
                placeholder="••••••••"
              />
            </label>
            {mode === "signup" && (
              <label className="block space-y-2 text-xs uppercase tracking-widest text-mv-muted">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-mv-border bg-transparent px-3 py-2 text-sm text-mv-text outline-none focus:border-mv-lime"
                  placeholder="••••••••"
                />
              </label>
            )}
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
            {message && (
              <p className="text-xs text-mv-lime">{message}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <p className="text-center text-xs text-mv-muted">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setMessage(null);
              }}
              className="text-mv-lime underline underline-offset-2 hover:no-underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center">
          <Link href="/" className="text-xs uppercase tracking-widest text-mv-muted hover:text-mv-lime">
            Back to home
          </Link>
        </p>
      </div>
    </Container>
  );
}
