import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import {
  Bot,
  Gift,
  MapPin,
  UtensilsCrossed,
  TreePine,
  Music,
  Baby,
  Plane,
  PiggyBank,
  Crown,
  Bell,
  Sparkles,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Coming Soon — A Complete Christmas" },
      {
        name: "description",
        content:
          "A sneak peek at the magical features on their way — AI assistants, gift finders, dinner planners and more.",
      },
      { property: "og:title", content: "Coming Soon — A Complete Christmas" },
      {
        property: "og:description",
        content: "The most magical Christmas features are on their way. Get notified when they land.",
      },
      { property: "og:url", content: "https://acompletechristmas.co.uk/coming-soon" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/coming-soon" }],
  }),
  component: ComingSoonPage,
});

interface Feature {
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tint: string;
  eta: string;
}

const features: Feature[] = [
  {
    emoji: "🎅",
    icon: Bot,
    title: "AI Christmas Assistant",
    desc: "Your personal festive concierge — ask anything, from gift ideas to gravy rescue, at any hour.",
    tint: "forest",
    eta: "Winter 2026",
  },
  {
    emoji: "🎁",
    icon: Gift,
    title: "Smart Gift Finder",
    desc: "Tell us who it's for. We'll match hobbies, budgets and delivery windows to gifts they'll actually love.",
    tint: "burgundy",
    eta: "Autumn 2026",
  },
  {
    emoji: "📍",
    icon: MapPin,
    title: "Christmas Events Map",
    desc: "Santa's grottos, light trails, markets and panto — plotted around your postcode with live availability.",
    tint: "forest",
    eta: "November 2026",
  },
  {
    emoji: "🍽️",
    icon: UtensilsCrossed,
    title: "Christmas Dinner Planner",
    desc: "Menus, shopping lists and a minute-perfect oven schedule tuned to your kitchen and serving time.",
    tint: "burgundy",
    eta: "Autumn 2026",
  },
  {
    emoji: "🎄",
    icon: TreePine,
    title: "Decoration Planner",
    desc: "Design your tree, mantelpiece and table with themes, shopping lists and reusable year-on-year plans.",
    tint: "forest",
    eta: "October 2026",
  },
  {
    emoji: "🎶",
    icon: Music,
    title: "Music & Film Planner",
    desc: "Curated playlists and film nights for every mood — cosy, kitchen-disco, tear-jerker or full-family.",
    tint: "burgundy",
    eta: "Winter 2026",
  },
  {
    emoji: "🧒",
    icon: Baby,
    title: "Santa Tracker & Family Activities",
    desc: "Track Santa's journey on Christmas Eve, plus daily advent activities to make the countdown magical.",
    tint: "forest",
    eta: "December 2026",
  },
  {
    emoji: "✈️",
    icon: Plane,
    title: "Christmas Travel Planner",
    desc: "Visiting family? We'll plan the journey, pack the boot list and remind you when to set off.",
    tint: "burgundy",
    eta: "Winter 2026",
  },
  {
    emoji: "💷",
    icon: PiggyBank,
    title: "Budget & Savings Tracker",
    desc: "Set a Christmas pot in January, save gently all year, and watch every gift and grocery slot in.",
    tint: "forest",
    eta: "Spring 2026",
  },
  {
    emoji: "🎟️",
    icon: Crown,
    title: "VIP Membership",
    desc: "Early access, exclusive printables, ad-free planning and priority answers from the assistant.",
    tint: "gold",
    eta: "Coming soon",
  },
];

function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Pop in a valid email so we can find you ✨");
      return;
    }
    setStatus("sending");
    setError("");
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase(), source: "coming-soon" });
    if (dbError && !dbError.message.includes("duplicate")) {
      setStatus("error");
      setError("Something went wonky. Try again in a mo.");
      return;
    }
    setStatus("done");
  }

  return (
    <PageShell
      eyebrow="On its way"
      title={
        <>
          <span className="block">Magical things,</span>
          <span className="block italic text-[color:var(--forest)]">unwrapping soon</span>
        </>
      }
      intro="A peek behind the curtain at what's coming next. Pop your email in and we'll let you know the moment each one lands."
    >
      {/* Notify me form */}
      <div className="mx-auto mb-16 max-w-xl rounded-3xl border border-[color:var(--border)] bg-[color:var(--mist)] p-6 sm:p-8 shadow-[var(--shadow-lift)]">
        <div className="flex items-center gap-2 text-[color:var(--forest)]">
          <Bell className="h-4 w-4" />
          <p className="text-[11px] font-medium uppercase tracking-[0.22em]">Notify me</p>
        </div>
        {status === "done" ? (
          <div className="mt-4 flex items-center gap-3 text-[15px] text-[color:var(--ink)]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--forest)]/10 text-[color:var(--forest)]">
              <Check className="h-4 w-4" />
            </span>
            You're on the list. We'll be in touch when the sleigh lands ✨
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@christmasy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-3 text-[15px] outline-none transition focus:border-[color:var(--forest)]"
            />
            <button type="submit" className="btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Notify me"}
              <Sparkles className="h-4 w-4" />
            </button>
          </form>
        )}
        {error ? <p className="mt-2 text-sm text-[color:var(--burgundy,#8b1e3f)]">{error}</p> : null}
      </div>

      {/* Feature cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <article
            key={f.title}
            className="rise-in group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {/* Corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{
                background:
                  f.tint === "gold"
                    ? "radial-gradient(circle, var(--gold) 0%, transparent 70%)"
                    : f.tint === "burgundy"
                      ? "radial-gradient(circle, oklch(0.45 0.12 15) 0%, transparent 70%)"
                      : "radial-gradient(circle, var(--forest) 0%, transparent 70%)",
              }}
            />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none" aria-hidden>
                  {f.emoji}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--forest)]/8 text-[color:var(--forest)]">
                  <f.icon className="h-5 w-5" />
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--gold-soft)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
                Coming soon
              </span>
            </div>

            <h3 className="relative mt-5 font-display text-[22px] leading-tight tracking-tight text-[color:var(--ink)]">
              {f.title}
            </h3>
            <p className="relative mt-2 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
              {f.desc}
            </p>
            <p className="relative mt-5 text-[11px] uppercase tracking-[0.2em] text-[color:var(--forest)]">
              Expected · {f.eta}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-16 text-center text-[13px] text-[color:var(--muted-foreground)]">
        Got a feature you're dreaming of? Reply to any of our emails — we read every one.
      </p>
    </PageShell>
  );
}
