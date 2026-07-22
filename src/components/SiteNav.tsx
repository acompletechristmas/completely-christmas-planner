import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, UserCircle2 } from "lucide-react";

type NavItem = { to: string; label: string; desc: string; auth?: boolean };

export const navItems: NavItem[] = [
  { to: "/", label: "Home", desc: "Back to the start of the story." },
  { to: "/planner", label: "My Christmas Planner", desc: "Your personal Christmas HQ — one place for everything.", auth: true },
  { to: "/planner", label: "Gift Planner", desc: "Track who you're buying for, budgets and wrapping.", auth: true },
  { to: "/inspire", label: "Decorations", desc: "Ideas to make your home feel magical this year." },
  { to: "/food", label: "Food & Recipes", desc: "Menus, timings and festive recipes to cook with love." },
  { to: "/days-out", label: "Christmas Activities", desc: "Markets, grottos, walks and days out near you." },
  { to: "/entertainment", label: "Films & Music", desc: "Cosy films and playlists for every moment." },
  { to: "/inspire", label: "Traditions & Ideas", desc: "Little rituals that make Christmas feel like home." },
  { to: "/teachers", label: "Teachers' Corner", desc: "Festive lessons, worksheets and classroom ideas." },
  { to: "/pets", label: "Christmas with Pets", desc: "Safe, joyful ways to include your furry family." },
  { to: "/save", label: "Budget & Savings", desc: "Stay in control with clear budgets and gentle saving." },
  { to: "/coming-soon", label: "Advent & Countdown", desc: "Daily magic as we count down to the big day." },
];

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
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 " +
          (scrolled || open
            ? "bg-[color:var(--midnight-deep)]/85 backdrop-blur-md border-b border-[color:var(--gold)]/20"
            : "bg-gradient-to-b from-black/60 via-black/25 to-transparent")
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-[15px] sm:text-[17px] tracking-wide text-[color:var(--cream)]">
              A Complete
            </span>
            <span className="font-display italic text-[22px] sm:text-[28px] -mt-1 gold-text">
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
          "fixed inset-0 z-30 transition-opacity duration-500 " +
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
                const active =
                  pathname === item.to ||
                  (item.to === "/planner" && pathname.startsWith("/planner"));
                return (
                  <Link
                    key={item.label}
                    to={href}
                    className={
                      "group relative rounded-2xl border px-5 py-4 transition-all duration-300 " +
                      (active
                        ? "border-[color:var(--gold)]/70 bg-[color:var(--gold)]/10"
                        : "border-[color:var(--gold)]/20 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/5")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-[19px] tracking-tight text-[color:var(--cream)] group-hover:text-[color:var(--gold)] transition-colors">
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

            <div className="mt-10 flex justify-center">
              <Link
                to={authHref}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/60 px-5 py-2.5 text-[13px] font-medium tracking-wide text-[color:var(--cream)] transition-all hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
              >
                <UserCircle2 className="h-4 w-4" />
                {user ? "Open my planner" : "Login or sign up"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
