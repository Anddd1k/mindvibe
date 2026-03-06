"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function AuthSignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (err) throw err;
      setMessage("Check your email for the confirmation link.");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm space-y-8">
        <div className="space-y-2">
          <Badge>MindVibe</Badge>
          <h1 className="text-2xl uppercase tracking-[0.25em] text-mv-lime">Sign up</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && <p className="text-xs text-red-400">{error}</p>}
          {message && <p className="text-xs text-mv-lime">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-xs text-mv-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-mv-lime underline underline-offset-2 hover:no-underline">
            Sign in
          </Link>
        </p>

        <p className="text-center">
          <Link href="/" className="text-xs uppercase tracking-widest text-mv-muted hover:text-mv-lime">
            Back to home
          </Link>
        </p>
      </div>
    </Container>
  );
}

