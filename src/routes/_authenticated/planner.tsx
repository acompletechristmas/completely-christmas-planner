import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, LogOut, Home } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({
    meta: [
      { title: "Your Christmas — A Complete Christmas" },
      { name: "description", content: "Your cosy little Christmas HQ. Plan gifts, food, films and all the fun." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlannerLayout,
});

function daysToChristmas(): number {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  const xmas = new Date(year, 11, 25);
  return Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86400000));
}

function firstName(email?: string | null, meta?: Record<string, unknown> | null): string {
  const name = (meta?.full_name as string | undefined) ?? (meta?.name as string | undefined);
  if (name) return name.split(" ")[0];
  if (email) return email.split("@")[0].replace(/[._-]/g, " ").split(" ")[0].replace(/^./, (c) => c.toUpperCase());
  return "friend";
}

function PlannerLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onOverview = pathname === "/planner";
  const name = firstName(user?.email, user?.user_metadata as Record<string, unknown> | null);
  const sleeps = daysToChristmas();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Snowfall count={40} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Top bar */}
      <header className="relative z-10 border-b border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.13_0.03_245_/_0.6)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/planner" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] twinkle">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
            </span>
            <span className="font-display text-base sm:text-lg">
              A Complete <span className="gold-text">Christmas</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!onOverview && (
              <Link
                to="/planner"
                className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[oklch(0.80_0.14_85_/_0.6)] hover:text-foreground"
              >
                <Home className="h-3.5 w-3.5" />
                My Christmas
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[oklch(0.80_0.14_85_/_0.6)] hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Warm greeting strip — only on overview */}
      {onOverview && (
        <section className="relative z-10 mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            🎄 Only {sleeps} sleeps to go
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            Hi {name}, ready to sprinkle a little{" "}
            <span className="gold-text">Christmas magic</span>?
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Your cosy Christmas HQ. Tap around, tick things off, and enjoy the run-up.
          </p>
        </section>
      )}

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8 sm:pt-10">
        <Outlet />
      </main>
    </div>
  );
}
