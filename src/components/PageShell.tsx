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

      <section className="relative isolate overflow-hidden">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.20 0.04 245 / 0.72) 0%, oklch(0.20 0.04 245 / 0.62) 40%, oklch(0.20 0.04 245 / 0.92) 82%, var(--background) 100%)",
              }}
            />
          </>
        ) : null}

        <div
          className={`relative z-10 mx-auto flex max-w-4xl flex-col justify-end px-5 sm:px-8 ${
            heroImage
              ? "min-h-[34vh] pt-24 pb-10 sm:min-h-[40vh] sm:max-h-[460px] sm:pt-32 sm:pb-14"
              : "pt-24 pb-8 sm:pt-28 sm:pb-12"
          }`}
        >
          <Link
            to="/"
            className="rise-in inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] transition hover:text-[color:var(--gold)]"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
          {eyebrow ? (
            <p className="rise-in mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--gold-soft)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className="rise-in mt-3 font-display text-[40px] leading-[1.05] tracking-tight sm:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            {title}
          </h1>
          {intro ? (
            <p
              className="rise-in mt-5 max-w-2xl text-[16px] leading-relaxed text-[color:var(--muted-foreground)] sm:text-[17px]"
              style={{ animationDelay: "0.12s" }}
            >
              {intro}
            </p>
          ) : null}
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</main>

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
