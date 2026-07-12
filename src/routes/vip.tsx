import { createFileRoute } from "@tanstack/react-router";
import { PageShell, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { Crown, Sparkles, Check, Bot, Gift, CalendarClock, Trophy, Printer, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/vip")({
  head: () => ({
    meta: [
      { title: "VIP — The Golden Ticket to Christmas" },
      { name: "description", content: "Unlimited AI, exclusive planners, VIP competitions, early booking access, members-only printables — and never an advert." },
      { property: "og:title", content: "VIP — The Golden Ticket to Christmas" },
      { property: "og:description", content: "The golden ticket to a truly complete Christmas." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/vip" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/vip" }],
  }),
  component: VipPage,
});

const perks = [
  { icon: ShieldCheck, title: "No adverts, ever", body: "A clean, calm experience — every visit, every year." },
  { icon: Bot, title: "Unlimited AI", body: "Gift finder, assistant, quiz builder and recipe helper with no daily caps." },
  { icon: CalendarClock, title: "Early booking access", body: "First look at partner grottos, panto and afternoon-tea reservations." },
  { icon: Trophy, title: "VIP competitions", body: "Members-only prize draws — from Christmas hampers to festive breaks." },
  { icon: Printer, title: "Exclusive printables", body: "Elf letters, gift tags, place cards, wrap templates and Christmas Eve boxes." },
  { icon: Gift, title: "Exclusive planners", body: "Deeper templates — Christmas travel, hosting overnight guests, blended-family logistics." },
];

function VipPage() {
  return (
    <PageShell
      eyebrow="VIP Membership"
      title={<><span className="block">The <span className="gold-text">Golden Ticket</span></span><span className="block">to Christmas</span></>}
      intro="Everything unlocked. Nothing in the way. The most magical way to plan your family's Christmas — with perks that keep giving."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>

      <div className="mx-auto mb-12 max-w-md rounded-3xl border border-[oklch(0.80_0.14_85_/_0.35)] p-8 text-center backdrop-blur-sm"
        style={{ background: "radial-gradient(ellipse at top, oklch(0.35 0.10 260 / 0.6) 0%, oklch(0.20 0.04 245) 70%)" }}
      >
        <Crown className="mx-auto h-8 w-8 text-[color:var(--gold)] twinkle" />
        <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Founding member</p>
        <p className="mt-3 font-display text-5xl gold-text">£29<span className="text-lg text-muted-foreground">/year</span></p>
        <p className="mt-2 text-xs text-muted-foreground">One festive season. All features. Locked-in rate for life.</p>
        <div className="mt-6 flex justify-center">
          <GoldCTA to="/auth"><Crown className="h-4 w-4" /> Join the waitlist</GoldCTA>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {perks.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--gradient-gold)" }}>
                <Icon className="h-5 w-5 text-[color:var(--primary-foreground)]" />
              </span>
              <h3 className="font-display text-xl">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--gold-soft)]">
              <Check className="h-3.5 w-3.5" /> Included with VIP
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <p className="max-w-md text-sm text-muted-foreground">Free forever core planner. VIP is for families who want a truly complete Christmas.</p>
        <GoldCTA to="/planner"><Sparkles className="h-4 w-4" /> Try the free planner</GoldCTA>
      </div>
    </PageShell>
  );
}
