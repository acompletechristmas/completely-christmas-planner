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
    <div className="relative min-h-screen bg-[color:var(--cream)] text-[color:var(--ink)]">
      <Snowfall count={18} />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--cream)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/planner" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] font-display text-sm">C</span>
            <span className="font-display text-[17px] tracking-tight">
              A Complete <span className="italic text-[color:var(--forest)]">Christmas</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!onOverview && (
              <Link
                to="/planner"
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--muted-foreground)] transition hover:text-[color:var(--ink)] hover:border-[color:var(--forest)]"
              >
                <Home className="h-3.5 w-3.5" />
                My Christmas
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3.5 py-1.5 text-xs font-medium text-[color:var(--muted-foreground)] transition hover:text-[color:var(--ink)] hover:border-[color:var(--forest)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Warm greeting strip — only on overview */}
      {onOverview && (
        <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--forest)]">
            {sleeps} sleeps until Christmas
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            Hi {name}, <span className="italic text-[color:var(--forest)]">welcome back</span>.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[color:var(--muted-foreground)]">
            Your quiet corner for gifts, food, and everything else. Take it a step at a time.
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
