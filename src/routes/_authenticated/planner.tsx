import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { Snowfall } from "@/components/Snowfall";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, LayoutDashboard, Gift, Mail, ListChecks, LogOut, BellRing } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({
    meta: [
      { title: "Christmas Planner — A Complete Christmas" },
      { name: "description", content: "Your gifts, cards, budget and to-do list — all in one calm place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PlannerLayout,
});

const tabs: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/planner", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/planner/reminders", label: "Never Miss", icon: BellRing },
  { to: "/planner/gifts", label: "Gifts", icon: Gift },
  { to: "/planner/cards", label: "Cards", icon: Mail },
  { to: "/planner/todos", label: "To-do", icon: ListChecks },
];


function PlannerLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] twinkle">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--gold)]" />
            </span>
            <span className="font-display text-base sm:text-lg">
              A Complete <span className="gold-text">Christmas</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {user?.email}
            </span>
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

      {/* Hero strip */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          Christmas Planner
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
          Christmas, <span className="gold-text">completely</span> organised
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          Every change saves automatically to your account.
        </p>

        {/* Tabs */}
        <nav className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition " +
                  (active
                    ? "border-[oklch(0.80_0.14_85_/_0.7)] bg-[oklch(0.80_0.14_85_/_0.12)] text-[color:var(--gold-soft)]"
                    : "border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] text-muted-foreground hover:border-[oklch(0.80_0.14_85_/_0.5)] hover:text-foreground")
                }
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </section>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
