import { Link } from "@tanstack/react-router";
import { useSnowfall } from "@/hooks/use-snowfall";

export function SiteFooter() {
  const { enabled, toggle } = useSnowfall();

  return (
    <footer className="relative z-10 mt-24 border-t border-[color:var(--border)] bg-[color:var(--mist)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] font-display text-sm">C</span>
            <span className="font-display text-[17px] tracking-tight">
              A Complete <span className="italic text-[color:var(--forest)]">Christmas</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-[color:var(--muted-foreground)]">
            The UK's calm, thoughtful home for everything Christmas.
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.18em] text-[color:var(--forest)]">Plan</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/planner" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">My planner</Link></li>
            <li><Link to="/gift-finder" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Gift finder</Link></li>
            <li><Link to="/food" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Christmas food</Link></li>
            <li><Link to="/save" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Save money</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.18em] text-[color:var(--forest)]">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/inspire" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Inspiration</Link></li>
            <li><Link to="/days-out" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Days out</Link></li>
            <li><Link to="/entertainment" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Entertainment</Link></li>
            <li><Link to="/pets" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">For pets</Link></li>
            <li><Link to="/teachers" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">For teachers</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.18em] text-[color:var(--forest)]">More</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/assistant" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">AI assistant</Link></li>
            <li><Link to="/partners" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">Partners</Link></li>
            <li><Link to="/vip" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)]">VIP</Link></li>
            <li>
              <button
                type="button"
                onClick={toggle}
                className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)] transition"
              >
                Snowfall: <span className="text-[color:var(--forest)]">{enabled ? "on" : "off"}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-[color:var(--muted-foreground)] sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} A Complete Christmas · Made in the UK</p>
          <p>Warmly, always.</p>
        </div>
      </div>
    </footer>
  );
}
