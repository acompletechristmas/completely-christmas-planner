import type { ReactNode } from "react";
import type { Experience } from "@/lib/days-out/experience-data";
import { ExperienceCard } from "./ExperienceCard";

interface CollectionRowProps {
  title: string;
  subtitle?: string;
  items: Experience[];
  showRating?: boolean;
  icon?: ReactNode;
}

export function CollectionRow({ title, subtitle, items, showRating, icon }: CollectionRowProps) {
  if (!items.length) return null;
  return (
    <section className="mt-12">
      <div className="flex items-baseline gap-2">
        {icon}
        <h2 className="font-display text-[26px] leading-tight tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {subtitle ? (
        <p className="mt-1 text-[15px] text-[color:var(--muted-foreground)]">{subtitle}</p>
      ) : null}
      <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((e) => (
          <div key={e.id} className="w-[82%] shrink-0 snap-start sm:w-[340px]">
            <ExperienceCard experience={e} showRating={showRating} />
          </div>
        ))}
      </div>
    </section>
  );
}
