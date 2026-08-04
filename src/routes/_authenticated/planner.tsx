import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Snowflake } from "lucide-react";
import plannerHero from "@/assets/planner-hero-cream.jpg";

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onOverview = pathname === "/planner";
  const name = firstName(user?.email, user?.user_metadata as Record<string, unknown> | null);
  const sleeps = daysToChristmas();

  return (
    <div className="planner-light relative min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      {/* Soft warm wash — purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(70% 45% at 12% 8%, oklch(0.86 0.09 88 / 0.20), transparent 72%), radial-gradient(60% 45% at 90% 85%, oklch(0.88 0.07 88 / 0.16), transparent 74%)",
        }}
      />
      <SiteNav />

      {/* Back to Planning HQ breadcrumb (not on overview) */}
      {!onOverview && (
        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-28">
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/40 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-[color:var(--foreground)]/85 backdrop-blur-sm transition hover:border-[color:var(--gold)] hover:text-[color:var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Planning HQ
          </Link>
        </div>
      )}

      {/* Bright luxury Christmas living room hero — only on overview */}
      {onOverview && (
        <section className="relative isolate overflow-hidden">
          <img
            src={plannerHero}
            alt=""
            aria-hidden="true"
            width={1536}
            height={1024}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* Warm cream wash so the welcome type reads, never navy */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to right, oklch(0.985 0.012 88 / 0.92) 0%, oklch(0.985 0.012 88 / 0.72) 38%, oklch(0.985 0.012 88 / 0.18) 70%, oklch(0.985 0.012 88 / 0.05) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 -z-10 h-32"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--background) 92%)",
            }}
          />
          <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-7xl flex-col px-5 pt-24 pb-10 sm:min-h-[58vh] sm:max-h-[560px] sm:px-8 sm:pt-28 sm:pb-14">
            {/* Countdown capsule */}
            <div className="flex justify-center">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--gold)]/60 bg-[oklch(0.99_0.01_90_/_0.88)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--gold-soft)] shadow-[0_8px_24px_-16px_oklch(0.6_0.12_70_/_0.6)] backdrop-blur-sm sm:text-xs">
                <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />
                {sleeps} sleeps until Christmas
                <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />
              </p>
            </div>

            <div className="mt-auto max-w-xl">
              <h1 className="font-display text-[42px] leading-[1.02] tracking-tight text-[color:var(--foreground)] sm:text-6xl">
                Hi {name},
                <span className="script-gold mt-1 block text-[46px] leading-[1.05] sm:text-7xl">welcome back</span>
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[color:var(--muted-foreground)]">
                Your quiet corner for gifts, food, and everything else. Take it a step at a time.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-6 sm:px-8 sm:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

