import { useState, type FormEvent } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

export interface LocationDateValues {
  location: string;
  from: string;
  to: string;
  radius: number;
}

interface Props {
  initial: LocationDateValues;
  searching: boolean;
  onSearch: (values: LocationDateValues) => void;
}

const RADII = [5, 10, 25, 50];

const fieldClass =
  "min-h-11 w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.6)] px-4 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--gold)] focus:outline-none";

export function LocationDateSearch({ initial, searching, onSearch }: Props) {
  const [values, setValues] = useState<LocationDateValues>(initial);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSearch(values);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.26_0.04_245_/_0.7)] p-5 backdrop-blur-sm"
      aria-label="Search festive activities near you"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
            Where
          </span>
          <div className="relative">
            <MapPin
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--gold)]"
            />
            <input
              type="text"
              inputMode="text"
              autoComplete="postal-code"
              placeholder="Postcode or town"
              value={values.location}
              onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
              className={`${fieldClass} pl-9`}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
            From
          </span>
          <input
            type="date"
            value={values.from}
            onChange={(e) => setValues((v) => ({ ...v, from: e.target.value }))}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
            To
          </span>
          <input
            type="date"
            value={values.to}
            onChange={(e) => setValues((v) => ({ ...v, to: e.target.value }))}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold-soft)]">
            Within
          </span>
          <select
            value={values.radius}
            onChange={(e) => setValues((v) => ({ ...v, radius: Number(e.target.value) }))}
            className={fieldClass}
          >
            {RADII.map((r) => (
              <option key={r} value={r}>
                {r} miles
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={searching}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-6 text-sm font-semibold text-[oklch(0.20_0.03_250)] transition hover:brightness-105 disabled:opacity-70 sm:w-auto"
      >
        {searching ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : (
          <Search aria-hidden className="h-4 w-4" />
        )}
        {searching ? "Searching" : "Find Christmas magic near me"}
      </button>
    </form>
  );
}
