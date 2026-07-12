import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { ChefHat, UtensilsCrossed, Clock, Wine, Cookie, ListChecks, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/food")({
  head: () => ({
    meta: [
      { title: "Christmas Food — A Complete Christmas" },
      { name: "description", content: "Recipes, dinner planner, cooking timeline, shopping lists, leftover ideas and festive drinks." },
      { property: "og:title", content: "Christmas Food — A Complete Christmas" },
      { property: "og:description", content: "The calm, delicious way to cook Christmas dinner." },
    ],
  }),
  component: FoodPage,
});

const bits = [
  { icon: UtensilsCrossed, title: "Christmas dinner planner", body: "Pick your menu — traditional, veggie, vegan, small — and get a personalised prep plan." },
  { icon: Clock, title: "Cooking timeline", body: "A precise minute-by-minute schedule for the big day, tuned to your oven and serving time." },
  { icon: ListChecks, title: "Shopping lists", body: "Auto-built by supermarket aisle, with cupboard-check for what you already have." },
  { icon: Cookie, title: "Baking & treats", body: "Mince pies, gingerbread, yule log, panettone — from beginner to showstopper." },
  { icon: Wine, title: "Drinks & pairings", body: "Mulled wine, alcohol-free spritzes, cheeseboard wines and cocktails your guests will remember." },
  { icon: ChefHat, title: "Boxing Day & leftovers", body: "Turkey curry, bubble & squeak, ham sandwiches that people fight over." },
];

function FoodPage() {
  return (
    <PageShell
      eyebrow="Christmas Food"
      title={<><span className="block">A calm, delicious</span><span className="block gold-text">Christmas kitchen</span></>}
      intro="From the shopping list to the leftovers — your festive food planner, timed to the minute."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bits.map((b) => <FeatureCard key={b.title} {...b} />)}
      </div>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Plan your menu today</span></div>
        <GoldCTA to="/planner"><Sparkles className="h-4 w-4" /> Open my planner</GoldCTA>
      </div>
    </PageShell>
  );
}
