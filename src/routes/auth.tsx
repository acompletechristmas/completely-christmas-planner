import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Snowfall } from "@/components/Snowfall";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — A Complete Christmas" },
      { name: "description", content: "Sign in to save your Christmas plans, gift lists and reminders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/planner" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/planner" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return; // browser navigating
    // popup path: onAuthStateChange will redirect
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <Snowfall count={50} />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.14_0.02_25_/_0.6)] twinkle">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
          </span>
          <span className="font-display text-xl">
            Completely <span className="gold-text">Christmas</span>
          </span>
        </Link>

        <div className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.14_0.02_25_/_0.85)] p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            {mode === "signin" ? "Welcome back" : "Start your Christmas"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to open your planner."
              : "Create your account to save every list, gift and reminder."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[oklch(0.80_0.14_85_/_0.3)] bg-[oklch(0.98_0.02_85)] px-4 py-3 text-sm font-medium text-[color:oklch(0.14_0.02_25)] transition hover:brightness-95 disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="hairline-gold flex-1" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">or</span>
            <div className="hairline-gold flex-1" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.18_0.025_25_/_0.8)] px-3.5 py-2.5 focus-within:border-[oklch(0.80_0.14_85_/_0.6)]">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="you@christmas.com"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Password
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.18_0.025_25_/_0.8)] px-3.5 py-2.5 focus-within:border-[oklch(0.80_0.14_85_/_0.6)]">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
              style={{ background: "var(--gradient-gold)" }}
            >
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-[color:var(--gold-soft)] underline-offset-2 hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.6C17 3.3 14.7 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.2-4.8 9.2-7.3 0-.5-.1-.9-.1-1.2H12z" />
    </svg>
  );
}
