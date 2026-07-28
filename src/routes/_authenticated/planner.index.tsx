import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePeople, type Person } from "@/hooks/use-people";
import { usePlannerSettings } from "@/hooks/use-planner-settings";
import { HOUSEHOLD_TYPES, CELEBRATION_STYLES } from "@/lib/household-options";
import {
  Gift,
  Sparkles,
  UtensilsCrossed,
  PartyPopper,
  Mail,
  Star,
  Home,
  ListChecks,
  ArrowRight,
  Plus,
  Users,
  CalendarDays,
  PoundSterling,
  Package,
  Settings2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/")({
  component: PlannerOverview,
});

const CURRENT_YEAR = new Date().getFullYear();

interface GiftRow extends BaseRow {
  item: string;
  person_id: string | null;
  price: number | null;
  status: string;
  year: number;
  is_idea: boolean;
  is_chosen: boolean;
  ordered: boolean;
  arrived: boolean;
  wrapped: boolean;
  sent: boolean;
  given: boolean;
}
interface OutingRow extends BaseRow {
  name: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  cost: number | null;
  booked: boolean;
  paid: boolean;
  completed: boolean;
}

interface Section {
  key: string;
  eyebrow: string;
  title: string;
  tagline: string;
  action: string;
  icon: LucideIcon;
  to: string;
  bg: string;
  accent: string;
  border: string;
  iconTint: string;
  glow: string;
}

const SECTIONS: Section[] = [
  {
    key: "plans",
    eyebrow: "YOUR MASTER PLAN",
    title: "My Christmas Plans",
    tagline: "Your master list — every to-do, ticked off in time.",
    action: "View my plans",
    icon: ListChecks,
    to: "/planner/todos",
    bg: "linear-gradient(160deg, oklch(0.24 0.09 350 / 0.85), oklch(0.17 0.07 350 / 0.92))",
    accent: "oklch(0.86 0.09 88 / 0.75)",
    border: "oklch(0.55 0.14 350 / 0.4)",
    iconTint: "oklch(0.90 0.09 88)",
    glow: "0 14px 40px -20px oklch(0.55 0.16 350 / 0.55)",
  },
  {
    key: "home",
    eyebrow: "HOME & DECORATIONS",
    title: "My Christmas Home",
    tagline: "Tree, lights, wreaths, guest beds, cosy corners.",
    action: "View home ideas",
    icon: Home,
    to: "/planner/my",
    bg: "linear-gradient(160deg, oklch(0.26 0.07 155 / 0.85), oklch(0.19 0.06 155 / 0.92))",
    accent: "oklch(0.94 0.05 90 / 0.7)",
    border: "oklch(0.55 0.14 155 / 0.35)",
    iconTint: "oklch(0.94 0.05 90)",
    glow: "0 14px 40px -20px oklch(0.55 0.14 155 / 0.5)",
  },
  {
    key: "food",
    eyebrow: "FOOD & HOSTING",
    title: "Food & Hosting",
    tagline: "Menus, orders, mince pies, the big day itself.",
    action: "View food plans",
    icon: UtensilsCrossed,
    to: "/planner/my",
    bg: "linear-gradient(160deg, oklch(0.28 0.11 25 / 0.82), oklch(0.19 0.09 25 / 0.92))",
    accent: "oklch(0.86 0.10 88 / 0.7)",
    border: "oklch(0.55 0.16 25 / 0.4)",
    iconTint: "oklch(0.88 0.10 88)",
    glow: "0 14px 40px -20px oklch(0.55 0.18 25 / 0.55)",
  },
  {
    key: "films",
    eyebrow: "FILMS & TV",
    title: "Films & TV",
    tagline: "The nights-in list — classics and comfort re-watches.",
    action: "View films",
    icon: Star,
    to: "/planner/my",
    bg: "linear-gradient(160deg, oklch(0.19 0.06 260 / 0.88), oklch(0.13 0.05 260 / 0.94))",
    accent: "oklch(0.86 0.09 88 / 0.65)",
    border: "oklch(0.50 0.10 260 / 0.4)",
    iconTint: "oklch(0.88 0.10 88)",
    glow: "0 14px 40px -20px oklch(0.45 0.12 260 / 0.55)",
  },
  {
    key: "music",
    eyebrow: "MUSIC & PLAYLISTS",
    title: "Music & Playlists",
    tagline: "Carols, jazz, singalongs — the soundtrack for the season.",
    action: "View music",
    icon: Sparkles,
    to: "/planner/my",
    bg: "linear-gradient(160deg, oklch(0.24 0.06 210 / 0.85), oklch(0.16 0.05 210 / 0.92))",
    accent: "oklch(0.86 0.08 88 / 0.65)",
    border: "oklch(0.50 0.10 210 / 0.4)",
    iconTint: "oklch(0.88 0.09 88)",
    glow: "0 14px 40px -20px oklch(0.45 0.12 210 / 0.55)",
  },
  {
    key: "cards",
    eyebrow: "CARDS & POST",
    title: "Cards & Post",
    tagline: "Write, address, post in time.",
    action: "View cards",
    icon: Mail,
    to: "/planner/cards",
    bg: "linear-gradient(160deg, oklch(0.24 0.08 155 / 0.82), oklch(0.17 0.06 155 / 0.92))",
    accent: "oklch(0.86 0.09 88 / 0.65)",
    border: "oklch(0.50 0.12 155 / 0.4)",
    iconTint: "oklch(0.88 0.10 88)",
    glow: "0 14px 40px -20px oklch(0.50 0.14 155 / 0.5)",
  },
  {
    key: "traditions",
    eyebrow: "TRADITIONS",
    title: "Traditions",
    tagline: "Elf on the shelf, midnight mass, family calls.",
    action: "View traditions",
    icon: PartyPopper,
    to: "/planner/my",
    bg: "linear-gradient(160deg, oklch(0.24 0.10 300 / 0.82), oklch(0.17 0.08 300 / 0.92))",
    accent: "oklch(0.86 0.09 88 / 0.65)",
    border: "oklch(0.50 0.12 300 / 0.4)",
    iconTint: "oklch(0.88 0.10 88)",
    glow: "0 14px 40px -20px oklch(0.50 0.14 300 / 0.55)",
  },
  {
    key: "checklist",
    eyebrow: "LAST-WEEK SWEEP",
    title: "Final Checklist",
    tagline: "The final sweep so nothing's forgotten.",
    action: "View checklist",
    icon: ListChecks,
    to: "/planner/todos",
    bg: "linear-gradient(160deg, oklch(0.26 0.06 245 / 0.85), oklch(0.18 0.05 245 / 0.92))",
    accent: "oklch(0.88 0.11 88 / 0.75)",
    border: "oklch(0.55 0.10 245 / 0.4)",
    iconTint: "oklch(0.88 0.11 88)",
    glow: "0 14px 40px -20px oklch(0.82 0.14 85 / 0.5)",
  },
];

function PlannerOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { people, loading: peopleLoading } = usePeople(user?.id);
  const { rows: gifts } = usePlannerList<GiftRow>("gifts", user?.id);
  const { rows: outings } = usePlannerList<OutingRow>("outings", user?.id);
  const { settings } = usePlannerSettings(user?.id);

  // One-time onboarding: send brand-new users to setup on their first visit.
  // Once they've completed setup, added a person, or saved a gift, we never
  // redirect again — Planning HQ opens directly.
  const redirectedRef = useRef(false);
  useEffect(() => {
    if (redirectedRef.current) return;
    if (!settings || peopleLoading) return;
    if (settings.setup_completed) return;
    if (people.length > 0 || gifts.length > 0) return;
    redirectedRef.current = true;
    void navigate({ to: "/planner/setup" });
  }, [settings, peopleLoading, people.length, gifts.length, navigate]);

  const householdChoices = HOUSEHOLD_TYPES.filter((o) => settings?.household_types?.includes(o.value));
  const styleChoices = CELEBRATION_STYLES.filter((o) => settings?.celebration_style?.includes(o.value));

  const namedGifts = useMemo(
    () => gifts.filter((g) => (g.item ?? "").trim().length > 0 && g.year === CURRENT_YEAR),
    [gifts],
  );

  const presents = namedGifts.filter((g) => g.is_chosen);
  const ideas = namedGifts.filter((g) => g.is_idea);
  const bought = presents.filter((g) => g.ordered);
  const wrapped = presents.filter((g) => g.wrapped);
  const given = presents.filter((g) => g.given || g.sent);
  const spent = bought.reduce((s, g) => s + (Number(g.price) || 0), 0);
  const budgetTotal = settings?.budget_total ? Number(settings.budget_total) : null;
  const overBudget = budgetTotal != null && spent > budgetTotal;

  const upcomingOutings = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...outings]
      .filter((o) => (o.name ?? "").trim().length > 0)
      .sort((a, b) => (a.event_date ?? "z").localeCompare(b.event_date ?? "z"))
      .slice(0, 5);
  }, [outings]);

  return (
    <div className="rise-in space-y-10">
      {/* 1. People & Presents — the first useful screen */}
      <section
        className="relative space-y-4 overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.20 0.06 250 / 0.85), oklch(0.14 0.05 250 / 0.92))",
          borderColor: "oklch(0.55 0.10 250 / 0.4)",
          boxShadow: "0 14px 40px -20px oklch(0.45 0.14 250 / 0.55)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.86 0.11 88 / 0.85), transparent)",
          }}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              <Gift className="h-3 w-3" /> GIFTS &amp; PEOPLE
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              My People &amp; Presents
            </h1>
            <p className="mt-1 text-sm text-[color:var(--cream)]/75">
              Everyone on your list — with every idea, present and price in one place.
            </p>
          </div>
          <Link
            to="/planner/gifts"
            className="hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110 sm:inline-flex"
            style={{ background: "var(--gradient-gold)" }}
          >
            View gifts <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Link
            to="/planner/gifts"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-[color:var(--forest-deep)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add person
          </Link>
          <Link
            to="/planner/gifts"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/50 bg-black/25 px-3 py-2 text-sm font-semibold text-[color:var(--cream)] transition hover:border-[color:var(--gold)]"
          >
            <Package className="h-4 w-4" /> Add present
          </Link>
          <Link
            to="/gift-finder"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/40 bg-black/20 px-3 py-2 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
          >
            <Sparkles className="h-4 w-4" /> Find gift ideas
          </Link>
          <Link
            to="/planner/outings"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[color:var(--gold)]/40 bg-black/20 px-3 py-2 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
          >
            <CalendarDays className="h-4 w-4" /> Find an event
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat value={presents.length} label={presents.length === 1 ? "present" : "presents"} />
          <MiniStat value={bought.length} label="bought" />
          <MiniStat value={wrapped.length} label="wrapped" />
          <MiniStat value={`£${spent.toFixed(0)}`} label="spent" />
        </div>

        {peopleLoading ? (
          <p className="text-sm text-muted-foreground">Loading your list…</p>
        ) : people.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[color:var(--gold)]/40 bg-black/25 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-[color:var(--gold)]" />
            <p className="mt-3 font-display text-xl">Add your first person</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Once someone's on your list you can add ideas, choose presents and track progress.
            </p>
            <Link
              to="/planner/gifts"
              className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[color:var(--forest-deep)]"
              style={{ background: "var(--gradient-gold)" }}
            >
              <Plus className="h-4 w-4" /> Add a person
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {people.slice(0, 8).map((p) => (
              <PersonRow key={p.id} person={p} gifts={namedGifts.filter((g) => g.person_id === p.id)} />
            ))}
            {people.length > 0 && (
              <Link
                to="/planner/gifts"
                className="flex min-h-[80px] items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--gold)]/40 bg-black/20 p-4 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)] hover:bg-black/30"
              >
                View gifts <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
        {ideas.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {ideas.length} gift idea{ideas.length === 1 ? "" : "s"} waiting to be chosen.{" "}
            <Link to="/planner/gifts" className="text-[color:var(--gold-soft)] hover:underline">
              Review ideas →
            </Link>
          </p>
        )}
      </section>


      {/* 2. Outings & Events */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              Outings &amp; Events
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">What you've booked in</h2>
          </div>
          <Link
            to="/planner/outings"
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/30 px-3 py-1.5 text-xs text-[color:var(--gold-soft)] hover:border-[color:var(--gold)]"
          >
            <Plus className="h-3 w-3" /> Add outing
          </Link>
        </div>
        {upcomingOutings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--gold)]/30 bg-[color:var(--forest-deep)]/40 p-6 text-center text-sm text-muted-foreground">
            No outings saved yet.{" "}
            <Link to="/planner/outings" className="text-[color:var(--gold-soft)] hover:underline">
              Add your first
            </Link>
            .
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {upcomingOutings.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-[color:var(--gold)]/20 bg-[color:var(--forest-deep)]/60 p-4"
              >
                <p className="font-display text-base">{o.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {o.event_date ?? "No date"}
                  {o.event_time ? ` · ${o.event_time}` : ""}
                  {o.location ? ` · ${o.location}` : ""}
                  {o.cost != null ? ` · £${Number(o.cost).toFixed(0)}` : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {o.booked && <Chip label="Booked" />}
                  {o.paid && <Chip label="Paid" />}
                  {o.completed && <Chip label="Done" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 3. Budget overview */}
      <section className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            Budget
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">What you've spent</h2>
        </div>
        <div className="rounded-3xl border border-[color:var(--gold)]/25 bg-[color:var(--forest-deep)]/60 p-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl gold-text">£{spent.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">
              {budgetTotal != null ? `of £${budgetTotal.toFixed(0)} planned` : "no overall budget set"}
            </p>
          </div>
          {budgetTotal != null && (
            <>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/25">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((spent / Math.max(1, budgetTotal)) * 100))}%`,
                    background: overBudget ? "var(--gradient-burgundy)" : "var(--gradient-gold)",
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {overBudget
                  ? `Over by £${(spent - budgetTotal).toFixed(0)}`
                  : `£${(budgetTotal - spent).toFixed(0)} still available`}
              </p>
            </>
          )}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat value={presents.length} label="presents" />
            <MiniStat value={given.length} label="given" />
            <MiniStat value={ideas.length} label="ideas" />
          </div>
          <Link
            to="/planner/setup"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[color:var(--gold-soft)] hover:underline"
          >
            <Settings2 className="h-3 w-3" /> Update budget & preferences
          </Link>
        </div>
      </section>

      {/* 4. Other planning sections */}
      <section className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            Other bits
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">Round out your Christmas</h2>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.key}>
                <Link
                  to={s.to}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-[oklch(0.26_0.04_245_/_0.7)] p-4 transition hover:-translate-y-0.5"
                  style={{ borderColor: s.border }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl text-[color:var(--midnight-deep)]"
                      style={{ background: s.gradient }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg">
                        {s.emoji} {s.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.tagline}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[color:var(--gold-soft)] transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 5. Personalisation (below main content — not a barrier) */}
      {(householdChoices.length > 0 || styleChoices.length > 0) && (
        <section className="rounded-3xl border border-[oklch(0.55_0.14_155_/_0.4)] bg-[oklch(0.22_0.05_155_/_0.4)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
                Your kind of Christmas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Used to tailor event suggestions and ideas — not shown inside Gifts.
              </p>
            </div>
            <Link
              to="/planner/setup"
              className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] px-3 py-1.5 text-[11px] text-[color:var(--gold-soft)]"
            >
              <Settings2 className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...householdChoices, ...styleChoices].map((o) => (
              <span
                key={o.value}
                className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-black/25 px-3 py-1 text-xs"
              >
                <span aria-hidden>{o.emoji}</span>
                {o.label}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MiniStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--gold)]/20 bg-[color:var(--forest-deep)]/60 p-3 text-center">
      <p className="font-display text-2xl text-[color:var(--gold-soft)]">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--pine-bright)]/40 bg-[color:var(--pine-bright)]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[color:var(--pine-bright)]">
      {label}
    </span>
  );
}

function PersonRow({ person, gifts }: { person: Person; gifts: GiftRow[] }) {
  const ideas = gifts.filter((g) => g.is_idea).length;
  const presents = gifts.filter((g) => g.is_chosen);
  const bought = presents.filter((g) => g.ordered).length;
  const wrapped = presents.filter((g) => g.wrapped).length;
  const given = presents.filter((g) => g.given || g.sent).length;
  const spent = presents.filter((g) => g.ordered).reduce((s, g) => s + (Number(g.price) || 0), 0);
  const budget = person.gift_budget != null ? Number(person.gift_budget) : null;

  return (
    <Link
      to="/planner/gifts"
      className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--forest-deep)]/70 p-4 transition hover:border-[color:var(--gold)]/60"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-base text-[color:var(--forest-deep)]"
          style={{ background: "var(--gradient-gold)" }}
        >
          {person.name?.[0]?.toUpperCase() || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base">{person.name || "Unnamed"}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {person.relationship ?? "Christmas list"}
            {budget != null ? ` · £${budget.toFixed(0)} budget` : ""}
          </p>
          <p className="mt-1 text-[12px] text-[color:var(--cream)]/85">
            {presents.length} present{presents.length === 1 ? "" : "s"} · {bought} bought · {wrapped} wrapped · {given} given
            {ideas > 0 ? ` · ${ideas} idea${ideas === 1 ? "" : "s"}` : ""}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[color:var(--gold-soft)]">
            <PoundSterling className="h-3 w-3" />£{spent.toFixed(0)}
            {budget != null ? ` of £${budget.toFixed(0)}` : ""} spent
          </p>
        </div>
      </div>
    </Link>
  );
}
