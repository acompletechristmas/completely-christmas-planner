import { createFileRoute } from "@tanstack/react-router";
import { PageShell, GoldCTA } from "@/components/PageShell";
import { FilterPills } from "@/components/days-out/FilterPills";
import { CollectionRow } from "@/components/days-out/CollectionRow";
import { ExperienceCard } from "@/components/days-out/ExperienceCard";
import { ExperienceEmptyState } from "@/components/days-out/ExperienceEmptyState";
import { useExperienceFilters } from "@/hooks/use-experience-filters";
import {
  EXPERIENCES,
  AUDIENCE_LABELS,
  PRICE_LABELS,
  SETTING_LABELS,
  TIME_LABELS,
  TYPE_LABELS,
  type Audience,
  type ExperienceType,
  type PriceBand,
  type Setting,
  type TimeOfDay,
} from "@/lib/days-out/experience-data";
import { Sparkles, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/days-out")({
  head: () => ({
    meta: [
      { title: "Christmas Magic Near Me — A Complete Christmas" },
      {
        name: "description",
        content:
          "Discover festive activities — Santa visits, markets, light trails, panto, skating, meals out, parties and family gatherings, from free ideas to splash-out treats.",
      },
      { property: "og:title", content: "Christmas Magic Near Me — A Complete Christmas" },
      {
        property: "og:description",
        content: "Free, budget and splash-out festive activities, all in one beautiful place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://acompletechristmas.co.uk/days-out" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/days-out" }],
  }),
  component: DaysOutPage,
});


const priceOptions = (Object.keys(PRICE_LABELS) as PriceBand[]).map((v) => ({
  value: v,
  label: PRICE_LABELS[v],
}));
const audienceOptions = (Object.keys(AUDIENCE_LABELS) as Audience[]).map((v) => ({
  value: v,
  label: AUDIENCE_LABELS[v],
}));
const timeOptions = (Object.keys(TIME_LABELS) as TimeOfDay[]).map((v) => ({
  value: v,
  label: TIME_LABELS[v],
}));
const settingOptions = (Object.keys(SETTING_LABELS) as Setting[]).map((v) => ({
  value: v,
  label: SETTING_LABELS[v],
}));
const typeOptions = (Object.keys(TYPE_LABELS) as ExperienceType[]).map((v) => ({
  value: v,
  label: TYPE_LABELS[v],
}));

function DaysOutPage() {
  const { filters, toggleFilter, clear, activeCount, results } = useExperienceFilters();

  const freeIdeas = EXPERIENCES.filter((e) => e.priceBand === "free" || e.priceBand === "budget");
  const familyDays = EXPERIENCES.filter(
    (e) => e.audiences.includes("toddlers") || e.audiences.includes("children"),
  );
  const splashOut = EXPERIENCES.filter((e) => e.priceBand === "splash");
  const grownUps = EXPERIENCES.filter(
    (e) => e.audiences.includes("adults") && e.timeOfDay.includes("evening"),
  );
  const bestRated = [...EXPERIENCES].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <PageShell
      eyebrow="Christmas Magic Near Me"
      title={
        <>
          <span className="block">Every kind of festive plan,</span>
          <span className="block gold-text">all in one place</span>
        </>
      }
      intro="Santa visits, markets, light trails, panto, skating, meals out, parties and family gatherings — browse by budget, by who's coming and by the kind of day you fancy."
    >
      {/* Discover → Choose → Organise. Saved activities live in the planner. */}
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-6 text-center backdrop-blur-sm">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
          Discover → Choose → Organise
        </p>
        <p className="text-sm text-muted-foreground">
          Found something lovely? Pop it into Festive Activities in your Christmas Planner and keep
          the date, cost and who's coming in one place.
        </p>
        <Link
          to="/planner/outings"
          className="min-h-11 rounded-full border border-[color:var(--gold)] px-5 py-3 text-sm font-semibold text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)]/10"
        >
          Open my Festive Activities
        </Link>
      </div>

      {/* Filters */}
      <section aria-label="Filter festive activities" className="space-y-5">
        <FilterPills
          legend="What kind of activity"

          options={typeOptions}
          selected={filters.type}
          onToggle={(v) => toggleFilter("type", v)}
        />
        <FilterPills
          legend="Budget"
          options={priceOptions}
          selected={filters.price}
          onToggle={(v) => toggleFilter("price", v)}
        />
        <FilterPills
          legend="Who's coming"
          options={audienceOptions}
          selected={filters.audience}
          onToggle={(v) => toggleFilter("audience", v)}
        />
        <FilterPills
          legend="When"
          options={timeOptions}
          selected={filters.time}
          onToggle={(v) => toggleFilter("time", v)}
        />
        <FilterPills
          legend="Indoors or out"
          options={settingOptions}
          selected={filters.setting}
          onToggle={(v) => toggleFilter("setting", v)}
        />
      </section>

      {/* Results */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-[26px] leading-tight tracking-tight sm:text-3xl">
            {results.length} festive {results.length === 1 ? "idea" : "ideas"}
          </h2>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-4 text-sm text-[color:var(--gold-soft)] transition hover:border-[color:var(--gold)]"
            >
              Clear filters ({activeCount})
            </button>
          ) : null}
        </div>

        {results.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((e) => (
              <ExperienceCard key={e.id} experience={e} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <ExperienceEmptyState onClear={clear} />
          </div>
        )}
      </section>

      {/* Curated collections */}
      <CollectionRow
        title="Best rated Christmas experiences"
        subtitle="The ones people rave about year after year."
        items={bestRated}
        showRating
        icon={<Star className="h-4 w-4 text-[color:var(--gold)]" />}
      />
      <CollectionRow
        title="Free festive magic"
        subtitle="Beautiful days out that cost nothing, or nearly nothing."
        items={freeIdeas}
        icon={<Sparkles className="h-4 w-4 text-[color:var(--gold)]" />}
      />
      <CollectionRow
        title="Little ones will love these"
        subtitle="Gentle, short and full of wonder — made for toddlers and children."
        items={familyDays}
      />
      <CollectionRow
        title="Worth splashing out on"
        subtitle="Once-a-year treats that everyone still talks about in March."
        items={splashOut}
      />
      <CollectionRow
        title="Grown-ups only evenings"
        subtitle="Candlelight, mulled wine and no one asking for the toilet."
        items={grownUps}
      />

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]">
          <Star className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.24em]">Never miss a booking window</span>
        </div>
        <GoldCTA to="/planner/reminders">Set my reminders</GoldCTA>
      </div>
    </PageShell>
  );
}
