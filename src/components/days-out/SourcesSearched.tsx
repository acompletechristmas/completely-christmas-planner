interface SourcesSearchedProps {
  searching: boolean;
  sources: { id: string; name: string; count: number }[] | undefined;
}

/**
 * Quiet transparency line: which enabled providers were actually searched.
 * Never lists dormant/unconfigured/failed providers — the server only reports
 * sources that ran successfully.
 */
export function SourcesSearched({ searching, sources }: SourcesSearchedProps) {
  if (searching) return null;

  if (!sources?.length) return null;

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12px] text-[color:var(--muted-foreground)]">
      <span>Sources searched:</span>
      {sources.map((s, i) => (
        <span key={s.id}>
          {i > 0 ? <span aria-hidden className="mr-1.5">•</span> : null}
          {s.name}
        </span>
      ))}
    </p>
  );
}
