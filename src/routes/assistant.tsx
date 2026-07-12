import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { Bot, MessagesSquare, Wand2, Lightbulb, ChefHat, Gift, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Christmas Assistant — A Complete Christmas" },
      { name: "description", content: "Ask anything: gift ideas, dinner plans, film picks, quiz builders and days out — right when you need it." },
      { property: "og:title", content: "AI Christmas Assistant — A Complete Christmas" },
      { property: "og:description", content: "Your always-on festive helper." },
    ],
  }),
  component: AssistantPage,
});

const bits = [
  { icon: Gift, title: "Gift dilemmas", body: "\"Something for my dad who has everything, under £60.\" Answered in seconds." },
  { icon: ChefHat, title: "Dinner rescue", body: "\"I've forgotten the cranberry sauce.\" Get a 15-minute recipe using pantry basics." },
  { icon: Lightbulb, title: "Family ideas", body: "\"What can we do with the kids this weekend that isn't a screen?\"" },
  { icon: Wand2, title: "Party planning", body: "Menus, timings, activities, playlists — for 4 people or 24." },
];

function AssistantPage() {
  return (
    <PageShell
      eyebrow="AI Christmas Assistant"
      title={<><span className="block">Ask, and</span><span className="block gold-text">Christmas answers</span></>}
      intro="A gentle, always-on helper for every last-minute question — from stocking fillers to timing the turkey."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>

      <div className="mx-auto mb-12 max-w-2xl rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
          <MessagesSquare className="h-3.5 w-3.5" /> Try asking
        </div>
        <div className="space-y-3">
          {[
            "Plan a cosy Christmas Eve for a family of 5",
            "10 stocking filler ideas for a 12-year-old boy",
            "A vegetarian Christmas dinner menu",
            "Family quiz — 4 rounds, 5 questions each",
          ].map((q) => (
            <div key={q} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.20_0.04_245_/_0.6)] px-4 py-3 text-sm text-foreground">
              <span className="text-[color:var(--gold)]">✦</span> {q}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Bot className="h-4 w-4" /> Coming this season
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {bits.map((b) => <FeatureCard key={b.title} {...b} />)}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Unlimited AI is included with VIP</span></div>
        <GoldCTA to="/vip"><Sparkles className="h-4 w-4" /> Explore VIP</GoldCTA>
      </div>
    </PageShell>
  );
}
