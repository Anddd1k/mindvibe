import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { Container } from "@/components/Container";
import { HeaderNav } from "@/components/HeaderNav";
import { AuthProvider } from "@/contexts/AuthContext";

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
        <AuthProvider>
          <header className="border-b border-mv-border">
            <Container>
              <div className="flex h-14 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-mv-lime" />
                  <Link href="/" className="text-sm uppercase tracking-[0.35em] hover:text-mv-lime">
                    MindVibe
                  </Link>
                </div>
                <HeaderNav />
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
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

