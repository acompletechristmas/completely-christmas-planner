import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowfall } from "@/components/Snowfall";
import { Sparkles } from "lucide-react";

type OAuthAuthorization = {
  redirect_url?: string;
  redirect_to?: string;
  client?: { name?: string; client_id?: string; redirect_uri?: string };
  scope?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthAuthorization | null; error: Error | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthAuthorization | null; error: Error | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthAuthorization | null; error: Error | null }>;
};

function oauth(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-2xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.85)] p-6 text-center text-foreground backdrop-blur-xl">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </div>
    </div>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";
  const redirectUri = details?.client?.redirect_uri;

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <Snowfall count={40} />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.80_0.14_85_/_0.35)] bg-[oklch(0.20_0.04_245_/_0.6)] twinkle">
            <Sparkles className="h-4 w-4 text-[color:var(--gold)]" />
          </span>
          <span className="font-display text-xl">
            A Complete <span className="gold-text">Christmas</span>
          </span>
        </div>

        <div className="rounded-3xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-[oklch(0.20_0.04_245_/_0.85)] p-8 shadow-[var(--shadow-card)] backdrop-blur-xl">
          <h1 className="font-display text-2xl leading-tight sm:text-3xl">
            Connect <span className="gold-text">{clientName}</span> to your Christmas
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This lets {clientName} act as you inside A Complete Christmas — read your people, gifts and reminders, and add new gift ideas.
          </p>

          {redirectUri && (
            <p className="mt-4 rounded-xl border border-[oklch(0.80_0.14_85_/_0.15)] bg-[oklch(0.26_0.04_245_/_0.6)] px-3 py-2 text-xs text-muted-foreground">
              Sends you back to: <span className="text-foreground">{redirectUri}</span>
            </p>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Your Christmas data stays protected by the app's own rules — {clientName} only sees what you can see.
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-[oklch(0.55_0.20_25_/_0.4)] bg-[oklch(0.30_0.10_25_/_0.4)] px-3 py-2 text-xs text-foreground">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => decide(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110 disabled:opacity-60"
              style={{ background: "var(--gradient-gold)" }}
            >
              Approve & connect
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => decide(false)}
              className="w-full rounded-xl border border-[oklch(0.80_0.14_85_/_0.25)] bg-transparent px-4 py-3 text-sm font-medium text-foreground transition hover:bg-[oklch(0.26_0.04_245_/_0.6)] disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
