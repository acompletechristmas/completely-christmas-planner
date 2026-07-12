import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Snowfall } from "@/components/Snowfall";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

interface PageShellProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  const { user } = useAuth();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Snowfall count={60} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.20_0.04_245_/_0.6)] twinkle">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
          </span>
          <span className="font-display text-lg tracking-tight sm:text-xl">
            A Complete <span className="gold-text">Christmas</span>
          </span>
        </Link>
        <Link
          to={user ? "/planner" : "/auth"}
          className="rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] px-4 py-2 text-xs font-medium tracking-wide text-[color:var(--gold-soft)] transition hover:bg-[oklch(0.80_0.14_85_/_0.08)]"
        >
          {user ? "Open Planner" : "Sign in"}
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-5 pt-6 pb-10 text-center sm:px-8 sm:pt-10">
        <Link
          to="/"
          className="rise-in inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground transition hover:text-[color:var(--gold-soft)]"
        >
          <ArrowLeft className="h-3 w-3" /> Back home
        </Link>
        {eyebrow ? (
          <p className="rise-in mt-6 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="rise-in mt-4 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className="rise-in mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
            style={{ animationDelay: "0.15s" }}
          >
            {intro}
          </p>
        ) : null}
      </section>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 sm:px-8">{children}</main>

      <footer className="relative z-10 border-t border-[oklch(0.80_0.14_85_/_0.15)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
            <span className="font-display text-sm text-foreground">A Complete Christmas</span>
          </div>
          <p>Made with warmth · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.26_0.04_245_/_0.6)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[oklch(0.80_0.14_85_/_0.5)] hover:shadow-[var(--shadow-card)]">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.8)]">
        <Icon className="h-5 w-5 text-[color:var(--gold)]" />
      </span>
      <h3 className="mt-4 font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}

interface CTAProps {
  to: string;
  children: ReactNode;
}

export function GoldCTA({ to, children }: CTAProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
      style={{ background: "var(--gradient-gold)" }}
    >
      {children}
    </Link>
  );
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
      <Sparkles className="h-3 w-3 twinkle" /> Santa's still wrapping this one
    </span>
  );
}
