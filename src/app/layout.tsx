import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "MindVibe",
  description: "A critical thinking challenge platform."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="min-h-dvh bg-mv-bg text-mv-text">
        <header className="border-b border-mv-border">
          <Container>
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-mv-lime" />
                <div className="text-sm uppercase tracking-[0.35em]">MindVibe</div>
              </div>
              <nav className="flex items-center gap-2">
                <ButtonLink href="/leaderboard" variant="ghost">
                  Leaderboard
                </ButtonLink>
                <ButtonLink href="/challenge/daily" variant="ghost">
                  Daily
                </ButtonLink>
              </nav>
            </div>
          </Container>
        </header>

        <main>
          <Container>
            <div className="py-10">{children}</div>
          </Container>
        </main>

        <footer className="border-t border-mv-border">
          <Container>
            <div className="flex h-14 items-center justify-between text-xs uppercase tracking-widest text-mv-muted">
              <span>Critical thinking. No spoilers.</span>
              <span>v0.1</span>
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}

