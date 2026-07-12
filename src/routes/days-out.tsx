import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { MapPin, Sparkles, TreePine, Ticket, Coffee, Snowflake, Bus, Star } from "lucide-react";

export const Route = createFileRoute("/days-out")({
  head: () => ({
    meta: [
      { title: "Christmas Magic Near Me — A Complete Christmas" },
      { name: "description", content: "Find Santa's grottos, pantomimes, Christmas markets, light trails and festive days out near you." },
      { property: "og:title", content: "Christmas Magic Near Me — A Complete Christmas" },
      { property: "og:description", content: "Postcode-powered festive discovery, so nothing magical passes you by." },
    ],
  }),
  component: DaysOutPage,
});

const experiences = [
  { icon: TreePine, title: "Santa's grottos", body: "The real Santas — from steam trains and Lapland UK to hidden woodland cabins — with booking dates that matter." },
  { icon: Ticket, title: "Pantomime & shows", body: "Local pantos, family theatre, ballet and carol concerts — with tickets that don't sell out on you." },
  { icon: Sparkles, title: "Light trails", body: "Botanical light trails, illuminations, and drive-through spectacles from November to January." },
  { icon: MapPin, title: "Christmas markets", body: "German-style stalls, food halls, ice rinks and market weekends — sorted by weekend to plan a day." },
  { icon: Coffee, title: "Afternoon teas", body: "Festive afternoon teas in country hotels, museums and townhouse tearooms." },
  { icon: Snowflake, title: "Festive stays", body: "Cabin weekends, cosy pubs with rooms, Christmas markets breaks — perfect for a two-night escape." },
];

function DaysOutPage() {
  return (
    <PageShell
      eyebrow="Christmas Magic Near Me"
      title={<><span className="block">The best festive days out,</span><span className="block gold-text">on your doorstep</span></>}
      intro="Enter your postcode and we'll surface the Santa experiences, markets and light trails worth booking — before they sell out."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>

      <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 text-left backdrop-blur-sm">
        <label className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Your postcode</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="e.g. SW1A 1AA"
            className="flex-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.6)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[color:var(--gold)] focus:outline-none"
          />
          <button
            type="button"
            className="rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Bus className="mr-1 inline h-4 w-4" /> Find magic
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Live discovery launches this autumn — save your postcode and we'll notify you.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((e) => <FeatureCard key={e.title} {...e} />)}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Never miss a booking window</span></div>
        <GoldCTA to="/planner/reminders">Set my reminders</GoldCTA>
      </div>
    </PageShell>
  );
}
