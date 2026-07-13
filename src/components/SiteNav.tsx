import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

const primary = [
  { to: "/inspire", label: "Inspire" },
  { to: "/days-out", label: "Days Out" },
  { to: "/food", label: "Food" },
  { to: "/entertainment", label: "Entertainment" },
  { to: "/save", label: "Save" },
] as const;

export function SiteNav() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const planLink = user ? "/planner" : "/auth";

  return (
    <header
      className={
        "sticky top-0 z-40 transition-colors duration-300 " +
        (scrolled
          ? "bg-[color:var(--midnight-deep)]/85 backdrop-blur-md border-b border-[color:var(--border)]"
          : "bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-full font-display text-sm text-[color:var(--midnight-deep)]" style={{ background: "var(--gradient-gold)" }}>
            C
          </span>
          <span className="font-display text-[17px] tracking-tight text-[color:var(--cream)]">
            A Complete <span className="gold-text not-italic">Christmas</span>
          </span>
        </Link>


        <nav className="hidden items-center gap-8 md:flex">
          {primary.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "text-[13.5px] font-medium tracking-tight transition-colors " +
                  (active
                    ? "text-[color:var(--gold)]"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--cream)]")
                }

              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={planLink}
            className="hidden sm:inline-flex btn-primary"
          >
            {user ? "My planner" : "Sign in"}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)] text-[color:var(--cream)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-[color:var(--midnight-deep)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
            {primary.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-3 text-[15px] font-medium text-[color:var(--cream)] border-b border-[color:var(--border)] last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <Link to={planLink} className="btn-primary mt-4 justify-center">
              {user ? "My planner" : "Sign in"}
            </Link>
          </div>
        </div>

      )}
    </header>
  );
}
