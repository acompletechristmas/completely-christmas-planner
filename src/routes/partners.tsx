import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { Handshake, Users, TrendingUp, Heart, Check, Loader2, Sparkles } from "lucide-react";

const CANONICAL = "https://acompletechristmas.co.uk/partners";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner with A Complete Christmas — Sponsorship & Brand Partnerships" },
      { name: "description", content: "Reach engaged UK families planning their Christmas early. Sponsorships, brand partnerships and affiliate opportunities with A Complete Christmas." },
      { property: "og:title", content: "Partner with A Complete Christmas" },
      { property: "og:description", content: "Reach engaged UK families planning their Christmas early. Sponsorships and brand partnerships." },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
  }),
  component: PartnersPage,
});

const audience = [
  { icon: Users, title: "UK families", body: "Parents, hosts and gift-givers planning Christmas from September onwards." },
  { icon: TrendingUp, title: "High-intent moments", body: "We reach users at the exact point they're booking, buying, or picking a menu." },
  { icon: Heart, title: "Trusted context", body: "Recommendations sit inside a calm, useful tool — not a noisy feed." },
];

const opportunities = [
  { title: "Sponsored days out", body: "Feature your Santa experience, market or attraction in the discovery feed with location-aware placement." },
  { title: "Recipe & product placement", body: "Ingredient sponsorships in the meal planner, gift ideas in the AI Gift Finder, retailer links in shopping lists." },
  { title: "Newsletter sponsorship", body: "Weekly Christmas countdown email with a single, tastefully-placed brand partner." },
  { title: "Category takeovers", body: "Own a category like drinks, crackers, decorations or Christmas Eve boxes for the season." },
];

const schema = z.object({
  company: z.string().trim().min(1, "Company name required").max(120),
  contact_name: z.string().trim().min(1, "Your name required").max(80),
  email: z.string().trim().email("Valid email required").max(255),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function PartnersPage() {
  const [form, setForm] = useState({ company: "", contact_name: "", email: "", website: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setStatus("submitting");
    const { error: insertError } = await supabase.from("partner_enquiries").insert({
      company: parsed.data.company,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      website: parsed.data.website || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message || null,
    });
    if (insertError) {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
  }

  return (
    <PageShell
      eyebrow="Partner with us"
      title={<><span className="block">Reach families who</span><span className="block gold-text">plan Christmas early</span></>}
      intro="A Complete Christmas is the UK's calm, year-round Christmas companion. If your brand belongs in a magical Christmas, let's talk."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {audience.map((a) => (
          <div key={a.title} className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] p-6">
            <a.icon className="h-6 w-6 text-[color:var(--gold)]" />
            <h3 className="mt-3 font-display text-xl">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl sm:text-4xl">Partnership <span className="gold-text">opportunities</span></h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {opportunities.map((o) => (
            <div key={o.title} className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6">
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-[color:var(--gold)]" />
                <h3 className="font-display text-lg">{o.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.7)] p-6 sm:p-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Get in touch</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Start a <span className="gold-text">conversation</span></h2>
          <p className="mt-3 text-sm text-muted-foreground">Tell us a little about your brand and we'll come back within a few working days with ideas and a media pack.</p>

          {status === "success" ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.4)] bg-[oklch(0.13_0.03_245_/_0.6)] p-8 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-full gold-glow" style={{ background: "var(--gradient-gold)" }}>
                <Check className="h-5 w-5 text-[color:var(--primary-foreground)]" />
              </span>
              <p className="font-display text-xl">Thank you</p>
              <p className="max-w-sm text-sm text-muted-foreground">We'll be in touch soon. In the meantime, feel free to explore the app.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required maxLength={120} placeholder="Company" value={form.company} onChange={(e) => update("company", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none" />
                <input required maxLength={80} placeholder="Your name" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required type="email" maxLength={255} placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none" />
                <input maxLength={255} placeholder="Website (optional)" value={form.website} onChange={(e) => update("website", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none" />
              </div>
              <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none">
                <option value="">Budget range (optional)</option>
                <option>Under £1k</option>
                <option>£1k – £5k</option>
                <option>£5k – £20k</option>
                <option>£20k+</option>
                <option>Let's discuss</option>
              </select>
              <textarea maxLength={2000} rows={5} placeholder="Tell us about your brand and what you're hoping to achieve…" value={form.message} onChange={(e) => update("message", e.target.value)} className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.13_0.03_245_/_0.6)] px-4 py-3 text-sm focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none" />
              <button type="submit" disabled={status === "submitting"} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110 disabled:opacity-60" style={{ background: "var(--gradient-gold)" }}>
                {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Sparkles className="h-4 w-4" /> Send enquiry</>}
              </button>
              {error ? <p className="text-center text-xs text-[color:var(--ember,#f87171)]">{error}</p> : null}
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
