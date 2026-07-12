import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { Bot, Gift, Heart, Sparkles, Users, Wand2, Star } from "lucide-react";

export const Route = createFileRoute("/gift-finder")({
  head: () => ({
    meta: [
      { title: "AI Gift Finder — A Complete Christmas" },
      { name: "description", content: "Answer a few questions and get thoughtful, personal Christmas gift ideas — from stocking fillers to luxury." },
      { property: "og:title", content: "AI Gift Finder — A Complete Christmas" },
      { property: "og:description", content: "The kindest, cleverest Christmas gift assistant." },
    ],
  }),
  component: GiftFinderPage,
});

const bits = [
  { icon: Users, title: "Any recipient", body: "Partner, mum, dad, teenager, in-laws, best friend, colleague — we've thought about all of them." },
  { icon: Heart, title: "Thoughtful, not generic", body: "Based on their personality, hobbies, love language and how well you know them." },
  { icon: Wand2, title: "Budget-aware", body: "Tell us the budget and get options in every bracket — with a stretch gift and a stocking filler." },
  { icon: Gift, title: "Save to your list", body: "Tap to add straight to your gift planner with the shop link and price tracked." },
];

function GiftFinderPage() {
  return (
    <PageShell
      eyebrow="AI Gift Finder"
      title={<><span className="block">The perfect gift,</span><span className="block gold-text">quietly conjured</span></>}
      intro="Tell us about the person. We'll suggest gifts they'll actually love — and remember why you chose it."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>

      <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 backdrop-blur-sm">
        <label className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Who is the gift for?</label>
        <input
          type="text"
          placeholder="e.g. My mum, loves gardening, £50 budget"
          className="mt-2 w-full rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.6)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--gold)] focus:outline-none"
        />
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Bot className="h-4 w-4" /> Conjure ideas
        </button>
        <p className="mt-3 text-xs text-muted-foreground">Full AI suggestions unlock this season — VIP gets unlimited.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {bits.map((b) => <FeatureCard key={b.title} {...b} />)}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Add ideas straight to your gift list</span></div>
        <GoldCTA to="/planner/gifts"><Sparkles className="h-4 w-4" /> Open my gift list</GoldCTA>
      </div>
    </PageShell>
  );
}
