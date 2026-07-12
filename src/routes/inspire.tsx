import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { Sparkles, TreePine, Gift, Home, Palette, Wand2, Snowflake, Star } from "lucide-react";

export const Route = createFileRoute("/inspire")({
  head: () => ({
    meta: [
      { title: "Christmas Inspiration — A Complete Christmas" },
      { name: "description", content: "Winter wonderland decor themes, table settings, tree ideas, Elf on the Shelf and Christmas Eve boxes." },
      { property: "og:title", content: "Christmas Inspiration — A Complete Christmas" },
      { property: "og:description", content: "Curated magical ideas to bring your Christmas to life." },
    ],
  }),
  component: InspirePage,
});

const ideas = [
  { icon: TreePine, title: "Tree themes", body: "Frosted forest, vintage gold, Nordic minimal, red velvet classic — pick a look you'll love again next year." },
  { icon: Palette, title: "Table settings", body: "Place settings, napkin folds, candle arrangements and centrepieces that photograph beautifully." },
  { icon: Home, title: "Outdoor lights", body: "Warm-white classic, colour-pop nostalgia, starlit trees and doorway garlands — with a shopping list." },
  { icon: Wand2, title: "Elf on the Shelf", body: "24 planned scenes with a props list, difficulty level and clean-up notes — never scramble again." },
  { icon: Gift, title: "Christmas Eve boxes", body: "Curated boxes by age: cosy, crafty, foodie, teen and grown-up — plus DIY printables." },
  { icon: Snowflake, title: "Winter crafts", body: "Salt-dough ornaments, orange garlands, paper snowflakes and wreath-making evenings." },
];

function InspirePage() {
  return (
    <PageShell
      eyebrow="Christmas Inspiration"
      title={<><span className="block">A whole world of</span><span className="block gold-text">winter wonder</span></>}
      intro="Beautiful, doable ideas — saved to your planner in one tap so you can find them again when you need them."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ideas.map((i) => <FeatureCard key={i.title} {...i} />)}
      </div>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Start building your Christmas</span></div>
        <GoldCTA to="/planner"><Sparkles className="h-4 w-4" /> Open my planner</GoldCTA>
      </div>
    </PageShell>
  );
}
