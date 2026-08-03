import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, signOut } from "@/hooks/use-auth";
import { Menu, X, UserCircle2, LogOut } from "lucide-react";

type NavItem = { to: string; label: string; desc: string; auth?: boolean; match?: string[] };

export const navItems: NavItem[] = [
  { to: "/", label: "Home", desc: "Back to the start of the story." },
  { to: "/build", label: "Plan it for me", desc: "A gentle, guided journey to your perfect Christmas." },
  { to: "/planner", label: "Planning HQ", desc: "Your personal Christmas HQ — one place for everything.", auth: true, match: ["/planner"] },
  { to: "/planner/people", label: "Gifts", desc: "People, presents and progress — all in one place.", auth: true, match: ["/planner/people", "/planner/gifts", "/planner/list"] },
  { to: "/gift-finder", label: "Gift Finder", desc: "Find the perfect present for anyone on your list." },
  { to: "/gift-finder/secret-santa", label: "Secret Santa", desc: "Quick gift ideas for any budget — sorted in a minute." },
  { to: "/planner/outings", label: "Festive Activities", desc: "Markets, parties, meals, trips and gatherings.", auth: true, match: ["/planner/outings"] },
  { to: "/days-out", label: "Christmas Magic Near Me", desc: "Discover festive activities to add to your planner.", match: ["/days-out"] },
  { to: "/inspire", label: "Decorations", desc: "Ideas to make your home feel magical this year.", match: ["/inspire"] },
  { to: "/food", label: "Food & Hosting", desc: "Menus, timings and festive recipes to cook with love." },
  { to: "/entertainment", label: "Films & Music", desc: "Cosy films and playlists for every moment.", match: ["/entertainment"] },
  { to: "/teachers", label: "Teachers' Corner", desc: "Festive lessons, worksheets and classroom ideas." },
  { to: "/pets", label: "Christmas with Pets", desc: "Safe, joyful ways to include your furry family." },
  { to: "/save", label: "My Christmas Budget", desc: "Stay in control with clear budgets and gentle saving." },
  { to: "/coming-soon", label: "Advent & Countdown", desc: "Daily magic as we count down to the big day." },
];

function isActive(item: NavItem, pathname: string): boolean {
  if (item.to === "/") return pathname === "/";
  const matches = item.match ?? [item.to];
  return matches.some((m) => pathname === m || pathname.startsWith(m + "/"));
}

export function SiteNav() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const authHref = user ? "/planner" : "/auth";

  return (
    <>
      <header
        className={
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
          (scrolled || open
            ? "bg-[color:var(--midnight-deep)]/85 backdrop-blur-md border-b border-[color:var(--gold)]/20"
            : "bg-gradient-to-b from-black/60 via-black/25 to-transparent")
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" aria-label="Go to homepage" className="flex flex-col leading-[0.9]">
            <span className="font-display text-[15px] sm:text-[17px] tracking-wide text-[color:var(--cream)]">
              A Complete
            </span>
            <span
              className="script-gold text-[34px] sm:text-[44px] -mt-0.5"
              style={{ lineHeight: 0.85 }}
            >
              Christmas
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={authHref}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/50 px-4 py-2 text-[13px] font-medium tracking-wide text-[color:var(--cream)] transition-all hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
            >
              <UserCircle2 className="h-4 w-4" />
              {user ? "My planner" : "Login"}
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/50 px-3.5 py-2 text-[13px] font-medium tracking-wide text-[color:var(--cream)] transition-all hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Elegant full-screen menu */}
      <div
        className={
          "fixed inset-0 z-40 transition-opacity duration-500 " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-[color:var(--midnight-deep)]/95 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        />
        <div className="relative flex h-full items-start justify-center overflow-y-auto pt-24 pb-16 sm:pt-28">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="mb-8 flex items-center gap-3 text-[color:var(--gold)]">
              <span className="text-xs">✦</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.32em]">
                Explore A Complete Christmas
              </span>
            </div>

            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {navItems.map((item) => {
                const href = item.auth && !user ? "/auth" : item.to;
                const active = isActive(item, pathname);
                return (
                  <Link
                    key={item.label}
                    to={href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "group relative rounded-2xl border px-5 py-4 transition-all duration-300 " +
                      (active
                        ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 shadow-[0_0_0_1px_var(--gold)]"
                        : "border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/5")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={
                        "font-display text-[19px] tracking-tight transition-colors " +
                        (active ? "text-[color:var(--gold)]" : "text-[color:var(--cream)] group-hover:text-[color:var(--gold)]")
                      }>
                        {item.label}
                      </span>
                      <span className="text-[color:var(--gold)]/70 transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-[color:var(--cream)]/70">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to={authHref}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/60 px-5 py-2.5 text-[13px] font-medium tracking-wide text-[color:var(--cream)] transition-all hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
              >
                <UserCircle2 className="h-4 w-4" />
                {user ? "Open my planner" : "Login or sign up"}
              </Link>
              {user ? (
                <button
                  type="button"
                  onClick={() => { signOut(); }}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/30 px-5 py-2.5 text-[13px] font-medium tracking-wide text-[color:var(--cream)]/80 transition-all hover:border-[color:var(--gold)]/70 hover:text-[color:var(--cream)]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
