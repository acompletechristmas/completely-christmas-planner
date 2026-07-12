import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { PiggyBank, TrendingDown, Tag, Sparkles, Gift, ShoppingBag, Wallet, Star } from "lucide-react";

export const Route = createFileRoute("/save")({
  head: () => ({
    meta: [
      { title: "Save Money at Christmas — A Complete Christmas" },
      { name: "description", content: "Smart Christmas budgets, curated deals, clever gift swaps and money-saving tricks that don't dim the magic." },
      { property: "og:title", content: "Save Money at Christmas — A Complete Christmas" },
      { property: "og:description", content: "Give a beautiful Christmas without the January regret." },
    ],
  }),
  component: SavePage,
});

const tips = [
  { icon: Wallet, title: "Auto-budget", body: "Set what you can afford and we'll split it across gifts, food, days out and cards — with gentle nudges as you go." },
  { icon: Tag, title: "Deal watchlist", body: "Add items to your list and we'll ping you when they drop — Black Friday, Boxing Day and everything between." },
  { icon: Gift, title: "Secret Santa & swaps", body: "Group draw, wishlist matching and price caps — perfect for extended family and workplaces." },
  { icon: TrendingDown, title: "Cheaper alternatives", body: "See dupe suggestions for popular gifts, plus own-brand food swaps that taste just as festive." },
  { icon: ShoppingBag, title: "Reward stacking", body: "Which loyalty schemes, cashback sites and vouchers to combine at the till, so every pound stretches." },
  { icon: PiggyBank, title: "Christmas savings plan", body: "Start in January, February or September — a simple weekly amount that funds this whole Christmas." },
];

function SavePage() {
  return (
    <PageShell
      eyebrow="Save Money"
      title={<><span className="block">A beautiful Christmas,</span><span className="block gold-text">without the January dread</span></>}
      intro="Simple, honest ways to spend less and enjoy it more — no coupon hunting, no compromise on the magic."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((t) => <FeatureCard key={t.title} {...t} />)}
      </div>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Track every penny in your planner</span></div>
        <GoldCTA to="/planner/gifts"><Sparkles className="h-4 w-4" /> Start my budget</GoldCTA>
      </div>
    </PageShell>
  );
}
