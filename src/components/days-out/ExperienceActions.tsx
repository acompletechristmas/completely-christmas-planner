import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarPlus, Check, ExternalLink, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { downloadIcs } from "@/lib/calendar-ics";
import { TYPE_LABELS, type Experience } from "@/lib/days-out/experience-data";

const actionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 text-[12px] font-medium text-[color:var(--forest)] transition hover:border-[color:var(--gold)] disabled:opacity-60";

const primaryActionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[color:var(--gold)] bg-[color:var(--gold)]/10 px-3.5 text-[12px] font-semibold text-[color:var(--forest)] transition hover:bg-[color:var(--gold)]/20";


/** Save an activity into the existing Festive Activities planner (outings). */
export function ExperienceActions({ experience }: { experience: Experience }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const place = [experience.venue, experience.town].filter(Boolean).join(", ");

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("outings").insert({
      user_id: user.id,
      name: experience.name,
      event_date: experience.startDate ?? null,
      event_time: experience.time ?? null,
      location: place || null,
      cost: experience.priceFrom ?? null,
      booking_url: experience.bookingUrl ?? experience.sourceUrl ?? null,
      notes: experience.blurb || null,
      planned: true,
    });
    setSaving(false);
    if (error) {
      toast.error("Couldn't save that one");
      return;
    }
    setSaved(true);
    toast.success("Saved to My Festive Activities");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {experience.startDate ? (
        <button
          type="button"
          className={actionClass}
          onClick={() =>
            downloadIcs({
              title: experience.name,
              date: experience.startDate!,
              time: experience.time ?? null,
              location: place || null,
              description: experience.blurb || TYPE_LABELS[experience.type],
              url: experience.bookingUrl ?? experience.sourceUrl ?? null,
            })
          }
        >
          <CalendarPlus aria-hidden className="h-3.5 w-3.5" />
          Add to calendar
        </button>
      ) : null}

      {user ? (
        <button type="button" className={actionClass} onClick={save} disabled={saving || saved}>
          {saving ? (
            <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <Check aria-hidden className="h-3.5 w-3.5" />
          ) : (
            <Heart aria-hidden className="h-3.5 w-3.5" />
          )}
          {saved ? "Saved" : "Save to My Festive Activities"}
        </button>
      ) : (
        <Link to="/auth" className={actionClass}>
          <Heart aria-hidden className="h-3.5 w-3.5" />
          Sign in to save
        </Link>
      )}
    </div>
  );
}
