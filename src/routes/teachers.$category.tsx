import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { findCategory, yearGroupLabel } from "@/lib/teacher-categories";
import { useEffect, useMemo, useState } from "react";
import { Printer, Wand2, Filter, Sparkles, Users, User, Monitor, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/teachers/$category")({
  head: ({ params }) => {
    const cat = findCategory(params.category);
    const title = cat ? `${cat.title} — Christmas Teaching Resources` : "Christmas Resources";
    const desc = cat?.blurb ?? "Christmas teaching resources.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    if (!findCategory(params.category)) throw notFound();
    return {};
  },
  notFoundComponent: () => (
    <PageShell title="Category not found" intro="That resource category doesn't exist.">
      <div className="text-center">
        <Link to="/teachers" className="text-[color:var(--gold-soft)] underline">Back to Teachers hub</Link>
      </div>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell title="Something went wrong" intro="We couldn't load these resources.">
      <div className="text-center">
        <Link to="/teachers" className="text-[color:var(--gold-soft)] underline">Back to Teachers hub</Link>
      </div>
    </PageShell>
  ),
  component: CategoryPage,
});

interface Resource {
  id: string;
  title: string;
  description: string | null;
  subcategory: string | null;
  year_min: number | null;
  year_max: number | null;
  subject: string | null;
  length_minutes: number | null;
  group_type: string | null;
  setting: string | null;
  printable: boolean;
  digital: boolean;
  difficulty: string | null;
  tags: string[];
  content_html: string | null;
  file_url: string | null;
  source: string;
  created_at: string;
}

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = findCategory(category)!;
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sub, setSub] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [group, setGroup] = useState<string>("all");
  const [format, setFormat] = useState<string>("all");
  const [length, setLength] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("is_public", true)
        .eq("category", category)
        .order("created_at", { ascending: false });
      setResources((data ?? []) as Resource[]);
      setLoading(false);
    })();
  }, [category]);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (sub !== "all" && r.subcategory !== sub) return false;
      if (year !== "all") {
        const y = parseInt(year, 10);
        const min = r.year_min ?? 0;
        const max = r.year_max ?? 6;
        if (y < min || y > max) return false;
      }
      if (group !== "all" && r.group_type !== group) return false;
      if (format === "printable" && !r.printable) return false;
      if (format === "digital" && !r.digital) return false;
      if (length !== "all") {
        const l = r.length_minutes ?? 0;
        if (length === "short" && l > 20) return false;
        if (length === "medium" && (l <= 20 || l > 45)) return false;
        if (length === "long" && l <= 45) return false;
      }
      return true;
    });
  }, [resources, sub, year, group, format, length]);

  return (
    <PageShell
      eyebrow={`${cat.emoji} ${cat.title}`}
      title={<span className="gold-text">{cat.title}</span>}
      intro={cat.blurb}
    >
      <Link
        to="/teachers"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-3 w-3" /> All categories
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
            <Filter className="h-3.5 w-3.5" /> Filter
          </div>
          <div className="mt-3 space-y-4 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] p-4">
            <FilterSelect label="Sub-category" value={sub} onChange={setSub} options={[{ v: "all", l: "All" }, ...cat.subcategories.map((s) => ({ v: s.slug, l: s.label }))]} />
            <FilterSelect
              label="Year / age"
              value={year}
              onChange={setYear}
              options={[
                { v: "all", l: "All ages" },
                { v: "0", l: "EYFS" },
                { v: "1", l: "Year 1" },
                { v: "2", l: "Year 2" },
                { v: "3", l: "Year 3" },
                { v: "4", l: "Year 4" },
                { v: "5", l: "Year 5" },
                { v: "6", l: "Year 6" },
              ]}
            />
            <FilterSelect label="Group" value={group} onChange={setGroup} options={[{ v: "all", l: "Any" }, { v: "individual", l: "Individual" }, { v: "group", l: "Group / class" }]} />
            <FilterSelect label="Format" value={format} onChange={setFormat} options={[{ v: "all", l: "Any" }, { v: "printable", l: "Printable" }, { v: "digital", l: "Digital" }]} />
            <FilterSelect
              label="Length"
              value={length}
              onChange={setLength}
              options={[
                { v: "all", l: "Any length" },
                { v: "short", l: "Under 20 min" },
                { v: "medium", l: "20–45 min" },
                { v: "long", l: "45 min+" },
              ]}
            />
          </div>
          <Link
            to="/teachers/generate"
            search={{ category }}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Wand2 className="h-4 w-4" /> Generate one instead
          </Link>
        </aside>

        {/* Results */}
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {loading ? "Loading…" : `${filtered.length} of ${resources.length} resources`}
          </p>
          {!loading && filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
              <h3 className="mt-3 font-display text-2xl">No matches yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try clearing a filter, or let the AI generate a fresh resource matched to your class.
              </p>
              <Link
                to="/teachers/generate"
                search={{ category }}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Wand2 className="h-4 w-4" /> Generate one
              </Link>
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {filtered.map((r) => (
                <li key={r.id} className="flex h-full flex-col rounded-2xl border border-[oklch(0.80_0.14_85_/_0.18)] bg-[oklch(0.26_0.04_245_/_0.6)] p-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
                    <span>{yearGroupLabel(r.year_min, r.year_max)}</span>
                    {r.subject ? <span>· {r.subject}</span> : null}
                    {r.length_minutes ? <span>· {r.length_minutes} min</span> : null}
                  </div>
                  <h3 className="mt-2 font-display text-xl leading-tight">{r.title}</h3>
                  {r.description ? <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.description}</p> : <div className="flex-1" />}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                    {r.printable ? <Chip icon={Printer}>Printable</Chip> : null}
                    {r.digital ? <Chip icon={Monitor}>Digital</Chip> : null}
                    {r.group_type === "individual" ? <Chip icon={User}>Individual</Chip> : r.group_type === "group" ? <Chip icon={Users}>Group</Chip> : null}
                    {r.difficulty ? <span className="rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-2 py-0.5 capitalize">{r.difficulty}</span> : null}
                  </div>
                  {r.content_html ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-[color:var(--gold-soft)]">Preview</summary>
                      <div
                        className="prose prose-invert mt-3 max-w-none text-sm text-foreground/90"
                        dangerouslySetInnerHTML={{ __html: r.content_html }}
                      />
                    </details>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">Full downloadable resource coming soon.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ v: string; l: string }>;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </label>
  );
}

function Chip({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-2 py-0.5">
      <Icon className="h-3 w-3" /> {children}
    </span>
  );
}
