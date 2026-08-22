import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import heroGifts from "@/assets/card-gifts.webp";
import { Bot, Gift, Heart, Sparkles, Users, Wand2, Star, Snowflake, ArrowRight, Search } from "lucide-react";


export const Route = createFileRoute("/gift-finder/")({
  head: () => ({
    meta: [
      { title: "AI Gift Finder — A Complete Christmas" },
      { name: "description", content: "Answer a few questions and get thoughtful, personal Christmas gift ideas — from stocking fillers to luxury." },
      { property: "og:title", content: "AI Gift Finder — A Complete Christmas" },
      { property: "og:description", content: "The kindest, cleverest Christmas gift assistant." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/gift-finder" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/gift-finder" }],
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
  const gifts = [
    {
      to: "/planner/gifts",
      eyebrow: "Live",
      title: "My Gift Planner",
      desc: "Keep track of who you're buying for, gift ideas, spending and wrapping.",
      cta: "Open Gift Planner",
      icon: Gift,
    },
    {
      to: "/gift-finder/secret-santa",
      eyebrow: "Live",
      title: "Secret Santa Gifts",
      desc: "Find funny, thoughtful or unusual Secret Santa gifts by budget.",
      cta: "Find Secret Santa gifts",
      icon: Snowflake,
    },
    {
      to: "#ai-gift-finder",
      eyebrow: "Coming soon",
      title: "Gift Finder",
      desc: "Find thoughtful gifts based on the person, their interests and your budget.",
      cta: "Preview Gift Finder",
      icon: Search,
    },
  ] as const;

  return (
    <PageShell
      heroImage={heroGifts}
      eyebrow="Gifts"
      title={<><span className="block">Everything gifts,</span><span className="block gold-text">in one place</span></>}
      intro="Pick a tool below. Each one works on its own — no AI needed."
    >
      <section aria-labelledby="gifts-tools" className="mb-14">
        <h2 id="gifts-tools" className="sr-only">Gift tools</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {gifts.map((g) => {
            const inner = (
              <>
                <div className="flex items-center gap-2 text-[color:var(--gold-soft)]">
                  <g.icon className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.24em]">{g.eyebrow}</span>
                </div>
                <h3 className="mt-3 font-display text-[24px] leading-tight tracking-tight text-[color:var(--cream)] sm:text-[26px]">
                  {g.title}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
                  {g.desc}
                </p>
                <span
                  className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-[color:var(--primary-foreground)] gold-glow transition group-hover:brightness-110"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  {g.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </>
            );
            const cls = "group flex flex-col rounded-2xl border-2 border-[color:var(--gold)]/50 bg-[oklch(0.26_0.04_245_/_0.85)] p-6 backdrop-blur-sm transition hover:border-[color:var(--gold)] hover:brightness-110 sm:p-7";
            if (g.to.startsWith("#")) {
              return <a key={g.to} href={g.to} className={cls}>{inner}</a>;
            }
            return <Link key={g.to} to={g.to as "/planner/gifts"} className={cls}>{inner}</Link>;
          })}
        </div>
      </section>

      <div id="ai-gift-finder" className="mb-6 flex items-center justify-center gap-3 scroll-mt-20">
        <span className="h-px flex-1 max-w-[80px] bg-[color:var(--gold)]/30" />
        <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">AI Gift Finder</span>
        <span className="h-px flex-1 max-w-[80px] bg-[color:var(--gold)]/30" />
      </div>
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>



      <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 backdrop-blur-sm">
        <label className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">Who is the gift for?</label>
        <input
          type="text"
          disabled
          aria-disabled="true"
          placeholder="e.g. My mum, loves gardening, £50 budget"
          className="mt-2 w-full cursor-not-allowed rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.6)] px-4 py-3 text-sm text-foreground opacity-60 placeholder:text-muted-foreground focus:outline-none"
        />
        <span
          aria-disabled="true"
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] opacity-55"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Bot className="h-4 w-4" /> Gift idea helper — coming soon
        </span>
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
