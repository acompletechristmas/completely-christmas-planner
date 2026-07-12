import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePerson, calcAge, usePeople } from "@/hooks/use-people";
import { usePersonGifts, uploadGiftPhoto, type Gift } from "@/hooks/use-person-gifts";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Camera,
  Heart,
  ThumbsUp,
  Frown,
  ExternalLink,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/planner/people/$personId")({
  component: PersonDetail,
});

const RATINGS: Array<{ value: string; label: string; icon: typeof Heart }> = [
  { value: "loved", label: "Loved it", icon: Heart },
  { value: "liked", label: "Liked it", icon: ThumbsUp },
  { value: "unused", label: "Didn't use", icon: Frown },
];

function PersonDetail() {
  const { personId } = Route.useParams();
  const { user } = useAuth();
  const { person, loading, updateField } = usePerson(personId, user?.id);
  const { removePerson } = usePeople(user?.id);
  const { gifts, loading: giftsLoading, addGift, updateField: updateGift, removeGift } = usePersonGifts(personId, user?.id);

  const grouped = useMemo(() => {
    const map = new Map<number, Gift[]>();
    for (const g of gifts) {
      const arr = map.get(g.year) ?? [];
      arr.push(g);
      map.set(g.year, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [gifts]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!person) return <p className="text-sm text-muted-foreground">Profile not found.</p>;

  const age = calcAge(person.date_of_birth);

  async function addForYear(year: number) {
    await addGift({ year, recipient: person!.name, status: "idea" });
  }

  return (
    <div className="rise-in space-y-8">
      <Link
        to="/planner/people"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-[color:var(--gold-soft)]"
      >
        <ArrowLeft className="h-3 w-3" /> All people
      </Link>

      {/* Profile header */}
      <section className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.6)] p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.4)] font-display text-2xl gold-text">
            {person.name?.[0]?.toUpperCase() || "?"}
          </span>
          <div className="flex-1">
            <input
              value={person.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-transparent font-display text-3xl outline-none"
              placeholder="Name"
            />
            <p className="text-xs text-muted-foreground">
              {person.relationship || "Add relationship"}
              {age != null ? ` · ${age} years old` : ""}
            </p>
          </div>
          <button
            onClick={async () => {
              if (confirm(`Remove ${person.name || "this person"}? Their gifts stay in your history.`)) {
                await removePerson(person.id);
                window.history.back();
              }
            }}
            className="rounded-full border border-[oklch(0.80_0.14_85_/_0.2)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--ember)] hover:text-[color:var(--ember)]"
          >
            Remove
          </button>
        </div>

        {/* Profile fields */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileField label="Relationship" value={person.relationship ?? ""} onChange={(v) => updateField("relationship", v || null)} />
          <ProfileField label="Date of birth" value={person.date_of_birth ?? ""} onChange={(v) => updateField("date_of_birth", v || null)} type="date" />
          <ProfileField label="Gift budget (£)" value={person.gift_budget == null ? "" : String(person.gift_budget)} onChange={(v) => updateField("gift_budget", v === "" ? null : Number(v))} type="number" />
          <ProfileField label="Clothing size" value={person.clothing_size ?? ""} onChange={(v) => updateField("clothing_size", v || null)} />
          <ProfileField label="Shoe size" value={person.shoe_size ?? ""} onChange={(v) => updateField("shoe_size", v || null)} />
          <ProfileField label="Favourite colours" value={person.favourite_colours ?? ""} onChange={(v) => updateField("favourite_colours", v || null)} />
          <ProfileField label="Favourite shops" value={person.favourite_shops ?? ""} onChange={(v) => updateField("favourite_shops", v || null)} />
          <ProfileField label="Hobbies & interests" value={person.hobbies ?? ""} onChange={(v) => updateField("hobbies", v || null)} />
          <ProfileField label="Favourite films" value={person.favourite_films ?? ""} onChange={(v) => updateField("favourite_films", v || null)} />
          <ProfileField label="Favourite books" value={person.favourite_books ?? ""} onChange={(v) => updateField("favourite_books", v || null)} />
          <ProfileField label="Favourite games" value={person.favourite_games ?? ""} onChange={(v) => updateField("favourite_games", v || null)} />
          <ProfileField label="Favourite characters" value={person.favourite_characters ?? ""} onChange={(v) => updateField("favourite_characters", v || null)} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ProfileArea label="Wishlist" value={person.wishlist ?? ""} onChange={(v) => updateField("wishlist", v || null)} />
          <ProfileArea label="Notes" value={person.notes ?? ""} onChange={(v) => updateField("notes", v || null)} />
        </div>
      </section>

      {/* Memories timeline */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)]">Christmas Memories</p>
            <h2 className="mt-1 font-display text-3xl">{person.name || "Their"} year by year</h2>
          </div>
          <button
            onClick={() => addForYear(new Date().getFullYear())}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Plus className="h-4 w-4" /> Add gift for {new Date().getFullYear()}
          </button>
        </div>

        {giftsLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading memories…</p>
        ) : gifts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.4)] p-10 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-[color:var(--gold)]" />
            <h3 className="mt-3 font-display text-2xl">No memories yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Add the first gift and start a Christmas history for {person.name || "them"} that grows every year.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {grouped.map(([year, list]) => {
              const total = list.reduce((s, g) => s + (Number(g.price) || 0), 0);
              return (
                <div key={year} className="rounded-2xl border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.5)] p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-3xl gold-text">{year}</span>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        {list.length} gift{list.length === 1 ? "" : "s"} · £{total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => addForYear(year)}
                      className="rounded-full border border-[oklch(0.80_0.14_85_/_0.3)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
                    >
                      + Add to {year}
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {list.map((g) => (
                      <GiftCard
                        key={g.id}
                        gift={g}
                        history={gifts.filter((x) => x.id !== g.id)}
                        userId={user?.id ?? ""}
                        onChange={(f, v) => updateGift(g.id, f, v)}
                        onRemove={() => removeGift(g.id)}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function ProfileArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full resize-none rounded-lg border border-transparent bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none hover:border-[oklch(0.80_0.14_85_/_0.2)] focus:border-[color:var(--gold)]"
      />
    </label>
  );
}

function GiftCard({
  gift,
  history,
  userId,
  onChange,
  onRemove,
}: {
  gift: Gift;
  history: Gift[];
  userId: string;
  onChange: <K extends keyof Gift>(field: K, value: Gift[K]) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const openInput = useRef<HTMLInputElement>(null);

  // Duplicate warning: similar item names in past years
  const dupe = useMemo(() => {
    if (!gift.item?.trim() || gift.item.length < 3) return null;
    const needle = gift.item.trim().toLowerCase();
    return history.find(
      (h) => h.year !== gift.year && h.item && h.item.toLowerCase().includes(needle.slice(0, Math.min(needle.length, 8))),
    );
  }, [gift, history]);

  async function handleUpload(field: "photo_url" | "opening_photo_url", file: File) {
    const url = await uploadGiftPhoto(userId, file);
    if (url) onChange(field, url);
  }

  return (
    <li className="rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-center">
        <input
          value={gift.item}
          onChange={(e) => onChange("item", e.target.value)}
          placeholder="What is it?"
          className="rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">£</span>
          <input
            type="number"
            value={gift.price == null ? "" : String(gift.price)}
            onChange={(e) => onChange("price", e.target.value === "" ? null : (Number(e.target.value) as never))}
            placeholder="0.00"
            className="w-full rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>
        <select
          value={gift.status}
          onChange={(e) => onChange("status", e.target.value as Gift["status"])}
          className="rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none"
        >
          <option value="idea">Idea</option>
          <option value="bought">Bought</option>
          <option value="wrapped">Wrapped</option>
          <option value="given">Given</option>
        </select>
        <div className="flex items-center gap-2 justify-self-end">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
          >
            {expanded ? "Less" : "More"}
          </button>
          <button onClick={onRemove} className="text-muted-foreground hover:text-[color:var(--ember)]" aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {dupe ? (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.30_0.05_60_/_0.3)] px-3 py-1.5 text-xs text-[color:var(--gold-soft)]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
          Similar to <strong className="mx-1">{dupe.item}</strong> in {dupe.year}. Double-check you don't repeat.
        </p>
      ) : null}

      {expanded ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <ProfileField label="Shop" value={gift.shop ?? ""} onChange={(v) => onChange("shop", (v || null) as never)} />
            <ProfileField
              label="Purchase date"
              value={gift.purchase_date ?? ""}
              onChange={(v) => onChange("purchase_date", (v || null) as never)}
              type="date"
            />
            <ProfileField label="Given by" value={gift.given_by ?? ""} onChange={(v) => onChange("given_by", (v || null) as never)} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={gift.wrapped} onChange={(e) => onChange("wrapped", e.target.checked)} />
              Wrapped
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={gift.delivered} onChange={(e) => onChange("delivered", e.target.checked)} />
              Delivered
            </label>
            {gift.url ? (
              <a href={gift.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[color:var(--gold-soft)]">
                <ExternalLink className="h-3.5 w-3.5" /> Link
              </a>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileArea label="Notes" value={gift.notes ?? ""} onChange={(v) => onChange("notes", (v || null) as never)} />
            <ProfileArea
              label="After Christmas notes"
              value={gift.post_notes ?? ""}
              onChange={(v) => onChange("post_notes", (v || null) as never)}
            />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rating</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {RATINGS.map((r) => {
                const Icon = r.icon;
                const active = gift.rating === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => onChange("rating", (active ? null : r.value) as never)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition " +
                      (active
                        ? "border-[color:var(--gold)] bg-[oklch(0.80_0.14_85_/_0.15)] text-[color:var(--gold-soft)]"
                        : "border-[oklch(0.80_0.14_85_/_0.2)] text-muted-foreground hover:border-[color:var(--gold)]/40")
                    }
                  >
                    <Icon className="h-3 w-3" /> {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoSlot
              label="Photo of the gift"
              url={gift.photo_url}
              onPick={() => photoInput.current?.click()}
              onClear={() => onChange("photo_url", null as never)}
            />
            <PhotoSlot
              label="Opening the gift"
              url={gift.opening_photo_url}
              onPick={() => openInput.current?.click()}
              onClear={() => onChange("opening_photo_url", null as never)}
            />
            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload("photo_url", f);
                e.target.value = "";
              }}
            />
            <input
              ref={openInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload("opening_photo_url", f);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      ) : null}
    </li>
  );
}

function PhotoSlot({
  label,
  url,
  onPick,
  onClear,
}: {
  label: string;
  url: string | null;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      {url ? (
        <div className="mt-1 overflow-hidden rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)]">
          <img src={url} alt="" className="h-40 w-full object-cover" />
          <div className="flex items-center justify-between bg-[oklch(0.20_0.04_245_/_0.7)] px-3 py-2 text-xs">
            <button onClick={onPick} className="text-muted-foreground hover:text-[color:var(--gold-soft)]">Replace</button>
            <button onClick={onClear} className="text-muted-foreground hover:text-[color:var(--ember)]">Remove</button>
          </div>
        </div>
      ) : (
        <button
          onClick={onPick}
          className="mt-1 flex h-40 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.26_0.04_245_/_0.4)] text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
        >
          <Camera className="h-5 w-5" />
          Upload photo
        </button>
      )}
    </div>
  );
}
