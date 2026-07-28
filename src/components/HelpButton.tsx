import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Sparkles, X } from "lucide-react";

const STARTERS: { label: string; q: string }[] = [
  { label: "I don't know where to start", q: "I don't know where to start with Christmas — help me plan." },
  { label: "Help me find a present", q: "Help me find a present." },
  { label: "Plan a festive day", q: "Plan a festive day out for us." },
  { label: "Ideas for grown-up children", q: "Ideas for grown-up children coming home for Christmas." },
  { label: "Help me decorate", q: "Give me ideas to decorate my home for Christmas." },
  { label: "Make me a Christmas checklist", q: "Make me a Christmas checklist." },
  { label: "Help me stay within budget", q: "Help me stay within my Christmas budget." },
  { label: "Surprise me with an idea", q: "Surprise me with a lovely Christmas idea." },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hide the floating help button whenever another modal locks body scroll,
  // so it can never cover a form field or action button.
  useEffect(() => {
    const check = () => setModalOpen(document.body.style.overflow === "hidden");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, []);

  const go = (q: string) => {
    setOpen(false);
    navigate({ to: "/assistant", search: { q } as never });
  };


  return (
    <>
      {!modalOpen && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="How can I help you?"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-[13px] font-medium text-[color:var(--midnight-deep)] shadow-2xl transition hover:brightness-110 sm:bottom-6 sm:right-6"
          style={{
            background: "linear-gradient(180deg, oklch(0.90 0.12 85), oklch(0.72 0.13 78))",
            border: "1px solid oklch(0.86 0.11 85 / 0.7)",
            boxShadow: "0 12px 40px -12px oklch(0.82 0.14 85 / 0.6)",
          }}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">How can I help you?</span>
          <span className="sm:hidden">Help</span>
        </button>
      )}



      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            className="relative m-3 w-full max-w-lg rounded-3xl p-6 sm:p-8"
            style={{
              background: "linear-gradient(180deg, oklch(0.20 0.04 245 / 0.98), oklch(0.14 0.03 245 / 0.98))",
              border: "1px solid oklch(0.86 0.11 85 / 0.35)",
              boxShadow: "0 30px 80px -30px rgba(0,0,0,0.85), inset 0 1px 0 oklch(1 0 0 / 0.06)",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[color:var(--gold)]/40 text-[color:var(--cream)] transition hover:bg-[color:var(--gold)]/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-[color:var(--gold)]">
              <span className="text-xs">✦</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em]">Here to help</span>
            </div>
            <h2 className="mt-3 font-display text-2xl leading-tight text-[color:var(--cream)] sm:text-3xl">
              What can I help with today?
            </h2>
            <p className="mt-2 text-sm text-[color:var(--cream)]/75">
              Tell me what you're trying to plan, find or organise. You don't need to know exactly what to ask.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => go(s.q)}
                  className="rounded-xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/5 px-4 py-3 text-left text-[13px] text-[color:var(--cream)] transition hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/10"
                >
                  <span className="text-[color:var(--gold)]">✦</span> {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
