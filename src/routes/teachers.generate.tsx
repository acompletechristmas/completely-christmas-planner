import { createFileRoute, Link, useServerFn } from "@tanstack/react-router";
import { useServerFn as useServerFnStart } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { generateResource, type GenerateResourceResult } from "@/lib/teacher-resources.functions";
import { TEACHER_CATEGORIES, findCategory } from "@/lib/teacher-categories";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Wand2, Printer, Download, Save, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  category: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/teachers/generate")({
  head: () => ({
    meta: [
      { title: "AI Christmas Resource Generator — A Complete Christmas" },
      { name: "description", content: "Generate a bespoke Christmas lesson plan, worksheet, quiz, comprehension, writing pack or assembly script in seconds — free." },
      { property: "og:title", content: "AI Christmas Resource Generator" },
      { property: "og:description", content: "Bespoke Christmas classroom resources, generated on demand." },
    ],
  }),
  validateSearch: zodValidator(searchSchema),
  component: GeneratePage,
});

const RESOURCE_TYPES: Array<{ value: string; label: string; blurb: string }> = [
  { value: "lesson-plan", label: "Lesson plan", blurb: "Objectives, activities, differentiation, plenary." },
  { value: "worksheet", label: "Worksheet", blurb: "Printable questions with answer space + answers." },
  { value: "quiz", label: "Quiz", blurb: "15–25 questions with answers, whole-class ready." },
  { value: "comprehension", label: "Reading comprehension", blurb: "Festive passage plus questions & answers." },
  { value: "writing-prompt", label: "Writing pack", blurb: "Scenario, vocabulary, sentence starters, success criteria." },
  { value: "assembly-script", label: "Assembly script", blurb: "Full script with parts, stage directions, carol." },
  { value: "display-idea", label: "Display idea", blurb: "Materials list, build steps and pupil work." },
];

const YEAR_OPTIONS = ["EYFS", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"];

function GeneratePage() {
  const search = Route.useSearch();
  const { user } = useAuth();
  // Prefer @tanstack/react-start's useServerFn; fall back to react-router's re-export.
  const runGenerate = (useServerFnStart ?? useServerFn)(generateResource);

  const [type, setType] = useState<string>("worksheet");
  const [topic, setTopic] = useState("");
  const [yearGroup, setYearGroup] = useState<string>("Year 3");
  const [subject, setSubject] = useState<string>("");
  const [length, setLength] = useState<number>(30);
  const [audience, setAudience] = useState<string>("whole class");
  const [notes, setNotes] = useState<string>("");
  const [result, setResult] = useState<GenerateResourceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const suggestedCategory = search.category ? findCategory(search.category) : undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Give it a topic to work with");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await runGenerate({
        data: {
          type,
          topic: topic.trim(),
          yearGroup,
          subject: subject.trim() || undefined,
          lengthMinutes: length,
          audience,
          notes: notes.trim() || undefined,
        },
      });
      setResult(res);
      // Scroll to output
      requestAnimationFrame(() => {
        document.getElementById("resource-output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveToLibrary() {
    if (!result || !user) return;
    setSaving(true);
    const category = suggestedCategory?.slug ?? typeToCategory(type);
    const { error } = await supabase.from("resources").insert({
      created_by: user.id,
      title: result.title,
      category,
      subcategory: null,
      description: `AI-generated ${RESOURCE_TYPES.find((t) => t.value === type)?.label.toLowerCase() ?? "resource"} on "${topic}".`,
      content_html: result.html,
      subject: subject.trim() || null,
      year_min: yearMin(yearGroup),
      year_max: yearMax(yearGroup),
      length_minutes: length,
      group_type: audience === "individual" ? "individual" : "group",
      printable: true,
      digital: true,
      source: "ai",
      is_public: true,
    });
    setSaving(false);
    if (error) toast.error("Couldn't save");
    else toast.success("Saved to the library");
  }

  function handlePrint() {
    if (!result) return;
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>${escapeHtml(result.title)}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #111; line-height: 1.55; }
        h1 { font-size: 26px; margin-bottom: 6px; }
        h2 { margin-top: 24px; }
        table { border-collapse: collapse; width: 100%; margin: 12px 0; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        ol, ul { padding-left: 22px; }
        @media print { body { margin: 20px; } }
      </style></head><body>${result.html}<script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob(
      [
        `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(result.title)}</title></head><body style="font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.55;">${result.html}</body></html>`,
      ],
      { type: "text/html" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(result.title)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell
      eyebrow="AI Resource Generator"
      title={<><span className="block">Any Christmas resource,</span><span className="block gold-text">in seconds.</span></>}
      intro="Tell us what you need. We'll generate a print-ready resource matched to your year group, subject and time slot."
    >
      <Link
        to="/teachers"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-3 w-3" /> Teachers hub
      </Link>

      <form onSubmit={submit} className="mt-6 rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">1. Pick a resource type</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={
                "rounded-xl border px-4 py-3 text-left text-sm transition " +
                (type === t.value
                  ? "border-[color:var(--gold)] bg-[oklch(0.80_0.14_85_/_0.12)]"
                  : "border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.6)] hover:border-[oklch(0.80_0.14_85_/_0.5)]")
              }
            >
              <p className="font-semibold text-foreground">{t.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.blurb}</p>
            </button>
          ))}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">2. Describe it</p>
        <div className="mt-3 space-y-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic e.g. Fractions using Christmas cakes, Nativity story sequencing, Christmas carols listening…"
            className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-3 text-sm outline-none focus:border-[color:var(--gold)]"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField label="Year group" value={yearGroup} onChange={setYearGroup} options={YEAR_OPTIONS} />
            <InputField label="Subject" value={subject} onChange={setSubject} placeholder="Maths, English…" />
            <InputField label="Length (min)" value={String(length)} onChange={(v) => setLength(Number(v) || 30)} type="number" />
            <SelectField label="Audience" value={audience} onChange={setAudience} options={["whole class", "small group", "individual"]} />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything else? (SEN adjustments, tone, must-include content, avoid religious references, etc.)"
            className="w-full resize-none rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] px-4 py-3 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Free for everyone this season · powered by Lovable AI</p>
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110 disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Conjuring…" : "Generate resource"}
          </button>
        </div>
      </form>

      {result ? (
        <section id="resource-output" className="mt-10 rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.98_0.02_85_/_0.98)] p-6 text-[#111] shadow-[var(--shadow-card)] sm:p-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-black/60">
              <Sparkles className="h-3 w-3" /> AI generated
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handlePrint} className="inline-flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-1.5 text-xs hover:bg-black/5"><Printer className="h-3.5 w-3.5" /> Print</button>
              <button onClick={handleDownload} className="inline-flex items-center gap-1.5 rounded-full border border-black/20 px-3 py-1.5 text-xs hover:bg-black/5"><Download className="h-3.5 w-3.5" /> Download</button>
              {user ? (
                <button
                  onClick={saveToLibrary}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs text-white hover:bg-black/85 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save to library"}
                </button>
              ) : (
                <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs text-white hover:bg-black/85">
                  <Save className="h-3.5 w-3.5" /> Sign in to save
                </Link>
              )}
            </div>
          </div>
          <article
            className="prose prose-neutral max-w-none prose-headings:font-serif prose-h1:mt-0 prose-table:my-3 prose-table:text-sm"
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
        </section>
      ) : null}

      {/* Category chips at the bottom to jump into curated library */}
      <section className="mt-16">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Or browse curated resources</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TEACHER_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/teachers/$category"
              params={{ category: c.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
            >
              <span>{c.emoji}</span> {c.title}
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.26_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function yearMin(y: string): number | null {
  if (y === "EYFS") return 0;
  const m = y.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}
function yearMax(y: string): number | null {
  return yearMin(y);
}
function typeToCategory(t: string): string {
  switch (t) {
    case "lesson-plan":
    case "comprehension":
      return "classroom-activities";
    case "worksheet":
      return "worksheets";
    case "quiz":
      return "quizzes";
    case "writing-prompt":
      return "writing";
    case "assembly-script":
    case "display-idea":
      return "classroom-extras";
    default:
      return "classroom-activities";
  }
}
function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "resource";
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
