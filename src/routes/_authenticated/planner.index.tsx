import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePlannerList, type BaseRow } from "@/hooks/use-planner-list";
import { usePeople } from "@/hooks/use-people";
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
  TreePine,
  UserPlus,
  Snowflake,
} from "lucide-react";
import { SectionIcon } from "@/components/planner/SectionShell";
import { PlannerButton } from "@/components/planner/PlannerButton";
import { BaubleIcon, RibbonIcon } from "@/components/planner/section-icons";
import type { LucideIcon } from "lucide-react";
import photoPlans from "@/assets/hq-plans.jpg";
import photoHome from "@/assets/hq-home.jpg";
import photoFood from "@/assets/hq-food.jpg";
import photoFilms from "@/assets/hq-films.jpg";
import photoMusic from "@/assets/hq-music.jpg";
import photoCards from "@/assets/hq-cards.jpg";
import photoTraditions from "@/assets/hq-traditions.jpg";
import photoChecklist from "@/assets/hq-checklist.jpg";
import photoActivities from "@/assets/hq-activities.jpg";
import photoBudget from "@/assets/hq-budget.jpg";

/** Warm cream veil laid over every card photograph so the navy/gold text stays legible. */
const CARD_VEIL =
  "linear-gradient(160deg, oklch(0.99 0.010 90 / 0.86) 0%, oklch(0.98 0.014 88 / 0.66) 45%, oklch(0.96 0.018 86 / 0.38) 100%)";

/** Warm, rich treatment so the Christmas photography reads as a feature again. */
const PHOTO_FILTER = "saturate(1.3) contrast(1.1) brightness(1.04)";

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
  photo: string;
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
    photo: photoPlans,
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
    photo: photoHome,
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
    photo: photoFood,
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
    photo: photoFilms,
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
    photo: photoMusic,
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
    photo: photoCards,
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
    photo: photoTraditions,
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
    photo: photoChecklist,
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

  // Days until Christmas — used for the snowy hero
  const today = new Date();
  const xmas = new Date(today.getFullYear(), 11, 25);
  if (today > xmas) xmas.setFullYear(xmas.getFullYear() + 1);
  const sleeps = Math.max(0, Math.ceil((xmas.getTime() - today.getTime()) / 86_400_000));
  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "there";

  return (
    <div className="rise-in space-y-10">
      {/* 1. My Christmas Gifts — warm cream planner panel */}
      <section className="relative overflow-hidden rounded-[28px] border border-[color:var(--gold)]/35 bg-[color:var(--card)] px-5 py-7 shadow-[var(--shadow-soft)] sm:px-8 sm:py-9">
        {/* Gold line-art flourish */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 120"
          className="pointer-events-none absolute right-2 top-3 hidden h-28 w-44 text-[color:var(--gold)]/55 sm:block"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M18 96C60 92 122 70 178 20" />
          <path d="M52 88c-6-12-2-24 8-30 4 12 2 24-8 30Z" />
          <path d="M74 78c-4-13 1-24 12-28 2 12-2 24-12 28Z" />
          <path d="M96 66c-3-13 3-24 14-27 1 12-4 23-14 27Z" />
          <path d="M118 54c-2-13 5-23 16-25 0 12-6 22-16 25Z" />
          <path d="M140 40c-1-13 7-22 18-23-1 12-8 21-18 23Z" />
          <path d="M60 92c11 3 20 0 25-9-12-3-21 0-25 9Z" />
          <path d="M84 82c11 3 20-1 24-10-12-2-21 1-24 10Z" />
          <path d="M108 70c11 2 20-2 23-11-12-2-20 2-23 11Z" />
          <path d="M132 56c11 2 19-3 22-12-12-1-19 3-22 12Z" />
          <path d="M172 44l2-7 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" />
          <path d="M156 14l1.5-5 1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5Z" />
          <path d="M188 74l1.5-5 1.5 5 5 1.5-5 1.5-1.5 5-1.5-5-5-1.5 5-1.5Z" />
        </svg>

        <p className="relative inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
          <Gift className="h-4 w-4" strokeWidth={1.5} /> GIFTS &amp; PEOPLE
        </p>
        <h2 className="relative mt-2 font-display text-[34px] leading-[1.05] tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          My Christmas Gifts
        </h2>
        <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
          Everyone you love, every little idea, every budget — kept safe in one beautiful place.
        </p>

        {/* Four premium gold actions */}
        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PlannerButton to="/planner/gifts" icon={UserPlus}>
            Add person
          </PlannerButton>
          <PlannerButton to="/planner/gifts" icon={Gift}>
            Add present
          </PlannerButton>
          <PlannerButton to="/gift-finder" icon={Sparkles}>
            Find gift ideas
          </PlannerButton>
          <PlannerButton to="/gift-finder/secret-santa" icon={Snowflake}>
            Secret Santa
          </PlannerButton>
        </div>

        {/* Gentle tip row */}
        <Link
          to="/planner/gifts"
          className="relative mt-4 flex items-center gap-4 rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--surface-sunk)] px-4 py-4 transition hover:border-[color:var(--gold)]/60"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[oklch(0.90_0.06_88_/_0.5)]">
            <Gift className="h-5 w-5 text-[color:var(--gold-soft)]" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1 text-sm leading-snug text-[color:var(--muted-foreground)]">
            <span className="font-semibold text-[color:var(--gold-soft)]">Tip:</span> Add people and gifts as ideas
            come to you. You can update and move things anytime.
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--gold-soft)]" />
        </Link>

        {/* Mini stats */}
        <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat value={presents.length} label={presents.length === 1 ? "present" : "presents"} />
          <MiniStat value={bought.length} label="bought" />
          <MiniStat value={wrapped.length} label="wrapped" />
          <MiniStat value={`£${spent.toFixed(0)}`} label="spent" />
        </div>

        {ideas.length > 0 && (
          <p className="relative mt-3 text-xs text-[color:var(--muted-foreground)]">
            {ideas.length} gift idea{ideas.length === 1 ? "" : "s"} waiting to be chosen.{" "}
            <Link to="/planner/gifts" className="text-[color:var(--gold-soft)] hover:underline">
              Review ideas →
            </Link>
          </p>
        )}
      </section>




      {/* 2. Festive Activities — Things We'd Love to Do */}
      <section
        className="relative space-y-3 overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: "oklch(0.55 0.14 155 / 0.4)",
          boxShadow: "0 14px 40px -20px oklch(0.55 0.14 155 / 0.5)",
        }}
      >
        <img
          src={photoActivities}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1024}
          height={768}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          style={{ filter: PHOTO_FILTER }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: CARD_VEIL }} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 z-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.85 0.09 90 / 0.8), transparent)",
          }}
        />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
              <CalendarDays className="h-3 w-3" /> FESTIVE ACTIVITIES
            </p>
            <h2 className="mt-1 flex items-center gap-2.5 font-display text-2xl sm:text-3xl"><SectionIcon icon={TreePine} /><span>Things We'd Love to Do</span></h2>
            <p className="mt-1 text-sm text-[color:var(--cream)]/75">
              Markets, panto, parties, meals out, trips and family gatherings — all in the diary.
            </p>
          </div>
          <Link
            to="/planner/outings"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--surface-sunk)] px-3 py-1.5 text-xs font-semibold text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
          >
            View activities <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {upcomingOutings.length === 0 ? (
          <div className="relative z-10 rounded-2xl border border-dashed border-[color:var(--gold)]/30 bg-[color:var(--surface-sunk)] p-6 text-center text-sm text-muted-foreground">
            No festive activities saved yet.{" "}
            <Link to="/planner/outings" className="text-[color:var(--gold-soft)] hover:underline">
              Add your first
            </Link>
            .
          </div>
        ) : (
          <ul className="relative z-10 grid gap-2 sm:grid-cols-2">
            {upcomingOutings.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-[color:var(--gold)]/20 bg-[color:var(--surface-sunk)] p-4"
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
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            <PoundSterling className="h-3 w-3" /> BUDGET
          </p>
          <h2 className="mt-1 flex items-center gap-2.5 font-display text-2xl sm:text-3xl"><SectionIcon icon={BaubleIcon} /><span>What you've spent</span></h2>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--gold)]/25 p-5">
          <img
            src={photoBudget}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1024}
            height={768}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            style={{ filter: PHOTO_FILTER }}
          />
          <span aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: CARD_VEIL }} />
          <div className="relative z-10 flex items-baseline justify-between">
            <p className="font-display text-3xl gold-text">£{spent.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">
              {budgetTotal != null ? `of £${budgetTotal.toFixed(0)} planned` : "no overall budget set"}
            </p>
          </div>
          {budgetTotal != null && (
            <>
              <div className="relative z-10 mt-3 h-2 w-full overflow-hidden rounded-full bg-[color:var(--surface-sunk)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((spent / Math.max(1, budgetTotal)) * 100))}%`,
                    background: overBudget ? "var(--gradient-burgundy)" : "var(--gradient-gold)",
                  }}
                />
              </div>
              <p className="relative z-10 mt-2 text-[11px] text-muted-foreground">
                {overBudget
                  ? `Over by £${(spent - budgetTotal).toFixed(0)}`
                  : `£${(budgetTotal - spent).toFixed(0)} still available`}
              </p>
            </>
          )}
          <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
            <MiniStat value={presents.length} label="presents" />
            <MiniStat value={given.length} label="given" />
            <MiniStat value={ideas.length} label="ideas" />
          </div>
          <Link
            to="/planner/setup"
            className="relative z-10 mt-4 inline-flex items-center gap-1.5 text-xs text-[color:var(--gold-soft)] hover:underline"
          >
            <Settings2 className="h-3 w-3" /> Update budget & preferences
          </Link>
        </div>
      </section>

      {/* 4. Other planning sections — each with its own muted Christmas identity */}
      <section className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">
            THE REST OF CHRISTMAS
          </p>
          <h2 className="mt-1 flex items-center gap-2.5 font-display text-2xl sm:text-3xl"><SectionIcon icon={RibbonIcon} /><span>Round out your Christmas</span></h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.key}>
                <Link
                  to={s.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                  style={{
                    borderColor: s.border,
                    boxShadow: s.glow,
                  }}
                >
                  <img
                    src={s.photo}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ filter: PHOTO_FILTER }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{ background: CARD_VEIL }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-4 top-0 z-10 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`,
                    }}
                  />
                  <div className="relative z-10 flex items-start gap-3">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
                      style={{
                        borderColor: s.accent,
                        background: "oklch(0 0 0 / 0.3)",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: s.iconTint }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: s.iconTint }}
                      >
                        {s.eyebrow}
                      </p>
                      <p className="mt-0.5 font-display text-lg leading-tight text-[color:var(--cream)]">
                        {s.title}
                      </p>
                    </div>
                  </div>
                  <p className="relative z-10 mt-3 text-xs text-[color:var(--cream)]/80">{s.tagline}</p>
                  <div className="relative z-10 mt-4 flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: s.iconTint }}
                    >
                      {s.action}
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                    <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--cream)]/60" style={{ borderColor: s.border }}>
                      Coming soon
                    </span>
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
                className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[color:var(--surface-sunk)] px-3 py-1 text-xs"
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
    <div className="rounded-2xl border border-[color:var(--gold)]/20 bg-[color:var(--surface-sunk)] p-3 text-center">
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

