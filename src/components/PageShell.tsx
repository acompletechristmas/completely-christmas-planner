import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Snowfall } from "@/components/Snowfall";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { ReactNode } from "react";

interface PageShellProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  heroImage?: string;
}

export function PageShell({ eyebrow, title, intro, children, heroImage }: PageShellProps) {
  return (
    <div className="relative min-h-screen text-[color:var(--foreground)]">
      <Snowfall count={45} />
      <SiteNav />


      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-10 pb-8 sm:px-8 sm:pt-16 sm:pb-12">
        <Link
          to="/"
          className="rise-in inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--forest)]"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        {eyebrow ? (
          <p className="rise-in mt-8 text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--forest)]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="rise-in mt-4 font-display text-[44px] leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className="rise-in mt-6 max-w-2xl text-[17px] leading-relaxed text-[color:var(--muted-foreground)]"
            style={{ animationDelay: "0.12s" }}
          >
            {intro}
          </p>
        ) : null}
      </section>

      {heroImage ? (
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-3xl">
            <img src={heroImage} alt="" className="h-[280px] w-full object-cover sm:h-[420px]" />
          </div>
        </div>
      ) : null}

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">{children}</main>

      <SiteFooter />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

export function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-[color:var(--border)] bg-[color:var(--mist)] p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--forest)]/8 text-[color:var(--forest)]">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <h3 className="mt-5 font-display text-[22px] leading-tight tracking-tight text-[color:var(--ink)]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">{body}</p>
    </article>
  );
}

interface CTAProps {
  to: string;
  children: ReactNode;
}

export function GoldCTA({ to, children }: CTAProps) {
  return (
    <Link to={to} className="btn-primary">
      {children}
    </Link>
  );
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--mist)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--forest)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" /> Coming soon
    </span>
  );
}
