import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Check, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  name: z.string().trim().max(80).optional().or(z.literal("")),
  postcode: z.string().trim().max(12).optional().or(z.literal("")),
});

interface WaitlistFormProps {
  source?: string;
  compact?: boolean;
}

export function WaitlistForm({ source = "home", compact = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, name, postcode });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setStatus("submitting");
    const { error: insertError } = await supabase.from("waitlist").insert({
      email: parsed.data.email,
      name: parsed.data.name || null,
      postcode: parsed.data.postcode || null,
      source,
    });
    if (insertError) {
      // Unique violation = already on the list — treat as success
      if (insertError.code === "23505") {
        setStatus("success");
        return;
      }
      setStatus("error");
      setError("Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[oklch(0.80_0.14_85_/_0.4)] bg-[oklch(0.20_0.04_245_/_0.7)] p-6 text-center backdrop-blur-sm">
        <span className="grid h-10 w-10 place-items-center rounded-full gold-glow" style={{ background: "var(--gradient-gold)" }}>
          <Check className="h-5 w-5 text-[color:var(--primary-foreground)]" />
        </span>
        <p className="font-display text-xl">You're on the list ✨</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          We'll be in touch with early access and Christmas countdown emails.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <input
          type="text"
          placeholder="First name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.7)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none"
        />
        <input
          type="text"
          placeholder="Postcode (optional)"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          maxLength={12}
          className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.7)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.80_0.14_85_/_0.6)] focus:outline-none"
        />
      </div>
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={255}
        className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.20_0.04_245_/_0.7)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.80_0.14_85_/_0.7)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] gold-glow transition hover:brightness-110 disabled:opacity-60"
        style={{ background: "var(--gradient-gold)" }}
      >
        {status === "submitting" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Adding you…</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Get early access</>
        )}
      </button>
      {error ? <p className="text-center text-xs text-[color:var(--ember,#f87171)]">{error}</p> : null}
      <p className="text-center text-[11px] text-muted-foreground">
        No spam. Unsubscribe anytime. We'll only email about Christmas.
      </p>
    </form>
  );
}
