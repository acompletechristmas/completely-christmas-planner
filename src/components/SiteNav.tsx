import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, UserCircle2 } from "lucide-react";

const primary = [
  { to: "/", label: "Home" },
  { to: "/planner", label: "Planner", auth: true },
  { to: "/inspire", label: "Inspiration" },
  { to: "/days-out", label: "Days Out" },
  { to: "/food", label: "Food & Recipes" },
] as const;

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

  const authHref = user ? "/planner" : "/auth";

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 " +
        (scrolled
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

        <nav className="hidden items-center gap-7 lg:flex">
          {primary.map((item) => {
            const href = item.auth && !user ? "/auth" : item.to;
            const active = pathname === item.to || (item.to === "/planner" && pathname.startsWith("/planner"));
            return (
              <Link
                key={item.label}
                to={href}
                className={
                  "relative text-[14px] font-medium tracking-wide transition-colors " +
                  (active
                    ? "text-[color:var(--gold)]"
                    : "text-[color:var(--cream)]/90 hover:text-[color:var(--gold)]")
                }
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[color:var(--gold)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={authHref}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/50 px-4 py-2 text-[13px] font-medium tracking-wide text-[color:var(--cream)] transition-all hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)]/10"
          >
            <UserCircle2 className="h-4 w-4" />
            {user ? "My planner" : "Login"}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-[color:var(--gold)]/40 text-[color:var(--cream)] backdrop-blur-sm"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[color:var(--gold)]/20 bg-[color:var(--midnight-deep)]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
            {primary.map((item) => {
              const href = item.auth && !user ? "/auth" : item.to;
              return (
                <Link
                  key={item.label}
                  to={href}
                  className="py-3 text-[15px] font-medium text-[color:var(--cream)] border-b border-[color:var(--gold)]/15 last:border-b-0"
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to={authHref} className="btn-festive mt-4 justify-center">
              <UserCircle2 className="h-4 w-4" />
              {user ? "My planner" : "Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
