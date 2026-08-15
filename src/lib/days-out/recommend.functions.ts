import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ExperienceIdea } from "@/lib/days-out/ideas";

const recommendInput = z.object({
  group: z.string().max(40).optional(),
  ages: z.string().max(60).optional(),
  moods: z.array(z.string().max(40)).max(20).optional(),
  location: z.string().max(80).optional(),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
  radiusMiles: z.number().optional(),
  seed: z.number().optional(),
  limit: z.number().optional(),
});

export interface IdeasResult {
  ideas: ExperienceIdea[];
  /** Which recommender produced them — curated rules today, AI later. */
  recommender: string;
}

/**
 * Provider-neutral recommendation seam. Returns IDEAS only — never events.
 * A real AI recommender can be registered behind this without UI changes.
 */
export const recommendIdeas = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => recommendInput.parse(data))
  .handler(async ({ data }): Promise<IdeasResult> => {
    const { isGroup, isMood } = await import("./ideas");
    const { recommendFromRules } = await import("./recommend/rules");

    const group = data.group && isGroup(data.group) ? data.group : undefined;
    const moods = (data.moods ?? []).filter(isMood);

    const ideas = recommendFromRules({
      ...(group ? { group } : {}),
      ...(data.ages ? { ages: data.ages } : {}),
      moods,
      ...(data.location ? { location: data.location } : {}),
      ...(data.from ? { from: data.from } : {}),
      ...(data.to ? { to: data.to } : {}),
      ...(data.radiusMiles != null ? { radiusMiles: data.radiusMiles } : {}),
      ...(data.seed != null ? { seed: data.seed } : {}),
      limit: data.limit ?? 6,
    });

    return { ideas, recommender: "curated-rules" };
  });
