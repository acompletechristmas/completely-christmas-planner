import { useState, useMemo, useRef } from "react";
import {
  Trash2,
  Camera,
  Heart,
  ThumbsUp,
  Frown,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { uploadGiftPhoto, type Gift } from "@/hooks/use-person-gifts";
import { ProfileField, ProfileArea } from "./ProfileFields";

const RATINGS: Array<{ value: string; label: string; icon: typeof Heart }> = [
  { value: "loved", label: "Loved it", icon: Heart },
  { value: "liked", label: "Liked it", icon: ThumbsUp },
  { value: "unused", label: "Didn't use", icon: Frown },
];

export function GiftCard({
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
          className="min-h-11 rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">£</span>
          <input
            type="number"
            value={gift.price == null ? "" : String(gift.price)}
            onChange={(e) => onChange("price", e.target.value === "" ? null : (Number(e.target.value) as never))}
            placeholder="0.00"
            className="min-h-11 w-full rounded-lg bg-[oklch(0.20_0.04_245_/_0.6)] px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]"
          />
        </div>
        <select
          value={gift.status}
          onChange={(e) => onChange("status", e.target.value as Gift["status"])}
          className="min-h-11 rounded-lg border border-[oklch(0.80_0.14_85_/_0.2)] bg-[oklch(0.20_0.04_245_/_0.7)] px-3 py-2 text-sm outline-none"
        >
          <option value="idea">Idea</option>
          <option value="bought">Bought</option>
          <option value="wrapped">Wrapped</option>
          <option value="given">Given</option>
        </select>
        <div className="flex items-center gap-2 justify-self-end">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="min-h-11 rounded-full border border-[oklch(0.80_0.14_85_/_0.25)] px-3 py-1.5 text-xs text-muted-foreground hover:border-[color:var(--gold)] hover:text-[color:var(--gold-soft)]"
          >
            {expanded ? "Less" : "More"}
          </button>
          <button
            onClick={onRemove}
            className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-[color:var(--ember)]"
            aria-label="Remove"
          >
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
                      "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition " +
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
