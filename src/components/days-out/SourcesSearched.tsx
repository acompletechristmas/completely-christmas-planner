interface ProviderStatus {
  id: string;
  name: string;
  status: "success" | "failed";
  count: number;
}

interface SourcesSearchedProps {
  searching: boolean;
  sources: { id: string; name: string; count: number }[] | undefined;
  providerStatus?: ProviderStatus[] | undefined;
}

/**
 * Quiet transparency line: which enabled providers were actually searched.
 * Never lists dormant/unconfigured/failed providers — but when a provider
 * failed we say so plainly instead of implying an empty live web search.
 */
export function SourcesSearched({ searching, sources, providerStatus }: SourcesSearchedProps) {
  if (searching) return null;

  const failed = (providerStatus ?? []).some((p) => p.status === "failed");

  if (!sources?.length && !failed) return null;

  return (
    <div className="mt-1 space-y-1">
      {sources?.length ? (
        <p className="flex flex-wrap items-center gap-x-1.5 text-[12px] text-[color:var(--muted-foreground)]">
          <span>Sources searched:</span>
          {sources.map((s, i) => (
            <span key={s.id}>
              {i > 0 ? <span aria-hidden className="mr-1.5">•</span> : null}
              {s.name}
            </span>
          ))}
        </p>
      ) : null}
      {failed ? (
        <p className="text-[12px] text-[color:var(--muted-foreground)]">
          Live web search is temporarily unavailable. Showing results from our other sources.
        </p>
      ) : null}
    </div>
  );
}
