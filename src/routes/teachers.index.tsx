import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TEACHER_CATEGORIES } from "@/lib/teacher-categories";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Wand2, Search, ArrowRight, Sparkles, Printer } from "lucide-react";

export const Route = createFileRoute("/teachers/")({
  head: () => ({
    meta: [
      { title: "Teachers & Education — A Complete Christmas" },
      { name: "description", content: "The UK's magical Christmas resource hub for teachers, home educators and parents. Printable worksheets, activities, quizzes, crafts and AI-generated lesson plans." },
      { property: "og:title", content: "Christmas Teaching Resources — A Complete Christmas" },
      { property: "og:description", content: "Printable and digital Christmas resources for every classroom, plus an AI resource generator." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/teachers" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/teachers" }],
  }),
  component: TeachersHub,
});

interface ResourceCard {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  year_min: number | null;
  year_max: number | null;
  subject: string | null;
  length_minutes: number | null;
  printable: boolean;
  digital: boolean;
}

function TeachersHub() {
  const [featured, setFeatured] = useState<ResourceCard[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data, count } = await supabase
        .from("resources")
        .select("id,title,description,category,subcategory,year_min,year_max,subject,length_minutes,printable,digital", { count: "exact" })
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(6);
      setFeatured((data ?? []) as ResourceCard[]);
      setTotal(count ?? 0);
    })();
  }, []);

  return (
    <PageShell
      eyebrow="Teachers & Education"
      title={<><span className="block">A magical staffroom,</span><span className="block gold-text">packed with Christmas.</span></>}
      intro="Ready-to-print classroom activities, worksheets, colouring, crafts, writing prompts, games and quizzes — plus an AI resource generator for anything you can't find."
    >
      {/* Search + generate CTA */}
      <div className="mx-auto -mt-2 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. Year 3 maths, letter to Santa, escape room…"
            className="w-full rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.7)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </label>
        <Link
          to="/teachers/generate"
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Wand2 className="h-4 w-4" /> Generate a resource
        </Link>
      </div>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
        {total > 0 ? `${total} resources ready to print, download and share.` : "Growing library — brand new resources land weekly."}
      </p>

      {/* Category grid */}
      <section className="mt-14">
        <h2 className="font-display text-3xl">Browse the library</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHER_CATEGORIES.map((cat) => {
            const filtered = query
              ? cat.title.toLowerCase().includes(query.toLowerCase()) ||
                cat.blurb.toLowerCase().includes(query.toLowerCase()) ||
                cat.subcategories.some((s) => s.label.toLowerCase().includes(query.toLowerCase()))
              : true;
            if (!filtered) return null;
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to="/teachers/$category"
                params={{ category: cat.slug }}
                className="group flex h-full flex-col justify-between rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 transition hover:-translate-y-0.5 hover:border-[oklch(0.80_0.14_85_/_0.5)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)]">
                      <Icon className="h-5 w-5 text-[color:var(--gold)]" />
                    </span>
                    <span className="text-2xl">{cat.emoji}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl">{cat.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{cat.blurb}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.subcategories.slice(0, 4).map((s) => (
                    <span key={s.slug} className="rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] px-2 py-0.5 text-[10px] text-muted-foreground">
                      {s.label}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 ? (
                    <span className="rounded-full bg-[oklch(0.80_0.14_85_/_0.12)] px-2 py-0.5 text-[10px] text-[color:var(--gold-soft)]">
                      +{cat.subcategories.length - 4} more
                    </span>
                  ) : null}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                  Browse <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured resources */}
      {featured.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Recently added</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <article
                key={r.id}
                className="flex h-full flex-col rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.20_0.04_245_/_0.6)] p-5"
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                  {r.subject ? <span>{r.subject}</span> : null}
                  {r.length_minutes ? <span>· {r.length_minutes} min</span> : null}
                </div>
                <h3 className="mt-2 font-display text-xl leading-tight">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                  {r.printable ? <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-2 py-0.5"><Printer className="h-3 w-3" /> Printable</span> : null}
                  {r.digital ? <span className="rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-2 py-0.5">Digital</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* Generator CTA */}
      <section className="mt-16 rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-8 text-center sm:p-12">
        <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
        <h2 className="mt-3 font-display text-4xl">Can't find exactly what you need?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Our AI can generate a bespoke lesson plan, worksheet, quiz, comprehension, assembly script or writing pack in seconds — matched to your year group, subject and time slot.
        </p>
        <div className="mt-6">
          <Link
            to="/teachers/generate"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Wand2 className="h-4 w-4" /> Open the AI generator
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
