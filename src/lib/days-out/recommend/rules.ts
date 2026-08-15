import type { ExperienceIdea, IdeaGroup, IdeaMood, RecommendationRequest } from "@/lib/days-out/ideas";

/**
 * Curated Christmas idea pool. Examples, not an exhaustive directory — a
 * richer AI recommender can replace this behind the same interface.
 * Nothing here is an event: no venues, dates, prices or links.
 */
export const IDEA_POOL: ExperienceIdea[] = [
  {
    id: "light-trail-dinner",
    title: "An evening light trail, then dinner",
    why: "A slow walk through the lights followed by somewhere warm to eat — the loveliest kind of Christmas evening.",
    tags: ["Evening", "Outdoors", "Food after"],
    types: ["lights", "meal"],
    keywords: ["christmas light trail", "illuminated trail", "festive dinner"],
    groups: ["couple", "adults_friends", "adult_children", "multi_gen", "older_children"],
    moods: ["romantic", "magical", "outdoors", "food", "different"],
  },
  {
    id: "candlelit-concert",
    title: "A candlelit Christmas concert",
    why: "Carols and candlelight in a beautiful building — atmospheric and completely unhurried.",
    tags: ["Evening", "Indoors", "Music"],
    types: ["community", "panto"],
    keywords: ["candlelit concert", "christmas concert", "carols by candlelight", "carol service"],
    groups: ["couple", "adults_friends", "adult_children", "alone", "multi_gen"],
    moods: ["romantic", "traditional", "cosy", "indoors", "relaxing"],
  },
  {
    id: "festive-afternoon-tea",
    title: "A festive afternoon tea",
    why: "Mince pie scones, a pot of tea and a couple of quiet hours together.",
    tags: ["Daytime", "Indoors", "Treat"],
    types: ["tea"],
    keywords: ["festive afternoon tea", "christmas afternoon tea"],
    groups: ["couple", "adults_friends", "adult_children", "multi_gen", "alone", "older_children"],
    moods: ["romantic", "cosy", "relaxing", "food", "luxury", "traditional"],
  },
  {
    id: "market-and-cocktails",
    title: "A Christmas market, then cocktails",
    why: "Browse the stalls in the cold, then head somewhere warm for a proper drink.",
    tags: ["Evening", "Outdoors", "Grown-ups"],
    types: ["market", "party"],
    keywords: ["christmas market", "festive bar", "christmas cocktails"],
    groups: ["couple", "adults_friends", "young_adults", "adult_children"],
    moods: ["fun", "food", "outdoors", "different", "romantic"],
  },
  {
    id: "wreath-workshop",
    title: "A wreath-making workshop",
    why: "You come home with something you made — and the house smells of spruce for a fortnight.",
    tags: ["Daytime", "Indoors", "Hands-on"],
    types: ["community"],
    keywords: ["wreath making workshop", "christmas wreath class"],
    groups: ["couple", "adults_friends", "adult_children", "alone", "teenagers"],
    moods: ["different", "cosy", "traditional", "active", "indoors"],
  },
  {
    id: "winter-spa",
    title: "A winter spa evening",
    why: "December is busy. An evening of warmth and quiet is a gift in itself.",
    tags: ["Evening", "Indoors", "Restful"],
    types: ["stay"],
    keywords: ["winter spa evening", "christmas spa day"],
    groups: ["couple", "adults_friends", "alone", "adult_children"],
    moods: ["relaxing", "luxury", "romantic", "indoors"],
  },
  {
    id: "christmas-theatre",
    title: "A night at the Christmas theatre",
    why: "A proper evening out — dress up a little, sit in the dark, come out full of Christmas.",
    tags: ["Evening", "Indoors"],
    types: ["panto"],
    keywords: ["christmas theatre", "festive show", "christmas play"],
    groups: ["couple", "adults_friends", "adult_children", "teenagers", "multi_gen", "older_children"],
    moods: ["traditional", "magical", "fun", "indoors"],
  },
  {
    id: "illuminated-house",
    title: "An illuminated historic house or garden",
    why: "Grand rooms dressed for Christmas, or gardens lit end to end — beautiful and easy to wander.",
    tags: ["Evening", "Outdoors"],
    types: ["lights"],
    keywords: ["illuminated gardens", "historic house christmas", "stately home christmas lights"],
    groups: ["couple", "multi_gen", "adult_children", "older_children", "adults_friends"],
    moods: ["magical", "traditional", "outdoors", "romantic", "relaxing"],
  },
  {
    id: "festive-stay",
    title: "A festive overnight stay",
    why: "Somewhere with a real fire, a Christmas tree in the hall and no washing-up.",
    tags: ["Overnight", "Treat"],
    types: ["stay"],
    keywords: ["christmas break", "festive overnight stay", "christmas weekend"],
    groups: ["couple", "adult_children", "multi_gen", "adults_friends"],
    moods: ["luxury", "romantic", "cosy", "relaxing", "different"],
  },
  {
    id: "father-christmas",
    title: "Meeting Father Christmas",
    why: "The one they'll talk about all year. Look for small groups and a proper grotto rather than a queue.",
    tags: ["Daytime", "Indoors", "Little ones"],
    types: ["grotto"],
    keywords: ["father christmas experience", "santa grotto", "meet santa"],
    groups: ["babies", "young_children", "multi_gen"],
    moods: ["magical", "traditional", "fun", "indoors"],
  },
  {
    id: "christmas-steam-train",
    title: "A Christmas steam train",
    why: "Steam, sleigh bells and a short ride — perfect for attention spans that don't last a whole day.",
    tags: ["Daytime", "Family"],
    types: ["grotto", "community"],
    keywords: ["christmas steam train", "santa express", "polar express train ride"],
    groups: ["babies", "young_children", "older_children", "multi_gen"],
    moods: ["magical", "traditional", "fun", "different"],
  },
  {
    id: "festive-farm",
    title: "A festive farm afternoon",
    why: "Animals, fresh air and a hot chocolate — low-key and easy with small children.",
    tags: ["Daytime", "Outdoors"],
    types: ["community"],
    keywords: ["christmas farm experience", "festive farm", "reindeer experience"],
    groups: ["babies", "young_children", "older_children", "multi_gen"],
    moods: ["outdoors", "fun", "budget", "magical"],
  },
  {
    id: "childrens-theatre",
    title: "A children's Christmas show",
    why: "Short, bright and made for younger audiences — much gentler than a full-length panto.",
    tags: ["Daytime", "Indoors"],
    types: ["panto"],
    keywords: ["childrens christmas show", "family christmas theatre"],
    groups: ["babies", "young_children", "older_children"],
    moods: ["magical", "fun", "indoors"],
  },
  {
    id: "family-light-trail",
    title: "A family light trail",
    why: "Wrap up warm and let them run ahead. Most trails take about an hour, which is just right.",
    tags: ["Evening", "Outdoors"],
    types: ["lights"],
    keywords: ["christmas light trail", "winter illuminations", "family light trail"],
    groups: ["young_children", "older_children", "babies", "multi_gen", "teenagers"],
    moods: ["magical", "outdoors", "fun", "budget"],
  },
  {
    id: "christmas-crafts",
    title: "A Christmas craft session",
    why: "Something to make, take home and hang on the tree — and it fills a whole rainy morning.",
    tags: ["Daytime", "Indoors", "Hands-on"],
    types: ["community"],
    keywords: ["christmas craft workshop", "children christmas crafts"],
    groups: ["young_children", "older_children", "babies", "teenagers"],
    moods: ["indoors", "fun", "budget", "active"],
  },
  {
    id: "ice-skating",
    title: "Ice skating under the lights",
    why: "Enough of an event to feel special, and nobody has to sit still.",
    tags: ["Any time", "Active"],
    types: ["skating"],
    keywords: ["christmas ice rink", "ice skating"],
    groups: ["older_children", "teenagers", "young_adults", "couple", "adults_friends", "adult_children"],
    moods: ["active", "fun", "outdoors", "different"],
  },
  {
    id: "escape-room",
    title: "A festive escape room or activity experience",
    why: "Competitive, funny and a genuine change from carols — teenagers and grown-up children love these.",
    tags: ["Any time", "Indoors", "Active"],
    types: ["party"],
    keywords: ["christmas escape room", "festive activity experience"],
    groups: ["teenagers", "young_adults", "adult_children", "adults_friends"],
    moods: ["different", "fun", "active", "indoors"],
  },
  {
    id: "street-food-market",
    title: "A festive street food night",
    why: "Lights, music and something to eat from every stall — easy going and good for mixed tastes.",
    tags: ["Evening", "Food"],
    types: ["market", "meal"],
    keywords: ["festive street food", "christmas market food", "winter food market"],
    groups: ["teenagers", "young_adults", "adults_friends", "adult_children", "multi_gen"],
    moods: ["food", "fun", "budget", "different"],
  },
  {
    id: "winter-walk-carols",
    title: "A carol service or village carols",
    why: "Free, traditional and often the moment Christmas finally lands.",
    tags: ["Evening", "Free"],
    types: ["community"],
    keywords: ["carol service", "village carols", "carols on the green"],
    groups: ["alone", "couple", "multi_gen", "adult_children", "young_children", "older_children"],
    moods: ["free", "traditional", "cosy", "budget"],
  },
  {
    id: "town-lights-switch-on",
    title: "A Christmas lights switch-on",
    why: "Costs nothing, feels like an occasion, and the whole town turns out.",
    tags: ["Evening", "Free", "Outdoors"],
    types: ["community", "lights"],
    keywords: ["christmas lights switch on", "town christmas lights"],
    groups: ["multi_gen", "young_children", "older_children", "teenagers", "alone", "couple"],
    moods: ["free", "budget", "outdoors", "traditional", "magical"],
  },
  {
    id: "christmas-cinema",
    title: "A Christmas film screening",
    why: "A classic on a big screen with an audience — far better than the sofa.",
    tags: ["Any time", "Indoors"],
    types: ["community"],
    keywords: ["christmas film screening", "festive cinema"],
    groups: ["alone", "couple", "teenagers", "young_adults", "older_children", "adults_friends"],
    moods: ["cosy", "budget", "indoors", "relaxing", "fun"],
  },
  {
    id: "christmas-lunch-out",
    title: "A proper Christmas lunch out",
    why: "One long table, crackers and someone else cooking. Book earlier than feels necessary.",
    tags: ["Daytime", "Food"],
    types: ["meal"],
    keywords: ["christmas lunch", "festive menu restaurant"],
    groups: ["multi_gen", "adult_children", "adults_friends", "couple", "young_adults"],
    moods: ["food", "traditional", "relaxing", "luxury"],
  },
  {
    id: "cathedral-visit",
    title: "A cathedral or minster at Christmas",
    why: "Quiet, beautiful and free to walk into — lovely on your own or with grandparents.",
    tags: ["Daytime", "Free", "Indoors"],
    types: ["community"],
    keywords: ["cathedral christmas", "christmas tree festival"],
    groups: ["alone", "multi_gen", "couple", "adult_children"],
    moods: ["free", "relaxing", "traditional", "indoors", "cosy"],
  },
  {
    id: "winter-garden-walk",
    title: "A winter garden or woodland walk",
    why: "Frost, low sun and a flask. The cheapest festive day out there is.",
    tags: ["Daytime", "Free", "Outdoors"],
    types: ["community"],
    keywords: ["winter garden walk", "festive woodland walk"],
    groups: ["alone", "couple", "multi_gen", "young_children", "older_children"],
    moods: ["free", "outdoors", "relaxing", "active", "budget"],
  },
  {
    id: "christmas-shopping-day",
    title: "A Christmas shopping day with a treat built in",
    why: "Make it an outing rather than an errand — lights, a long lunch and one good present found.",
    tags: ["Daytime"],
    types: ["market", "meal"],
    keywords: ["christmas shopping event", "late night christmas shopping"],
    groups: ["teenagers", "young_adults", "adult_children", "adults_friends", "couple"],
    moods: ["fun", "food", "different", "budget"],
  },
  {
    id: "panto-multigen",
    title: "Panto with all the generations",
    why: "The one thing a toddler and a grandparent will both enjoy, loudly.",
    tags: ["Daytime", "Indoors"],
    types: ["panto"],
    keywords: ["pantomime", "christmas panto"],
    groups: ["multi_gen", "young_children", "older_children", "babies"],
    moods: ["traditional", "fun", "magical", "indoors"],
  },
];

function scoreIdea(idea: ExperienceIdea, group: IdeaGroup | undefined, moods: IdeaMood[]): number {
  let score = 0;
  if (group) {
    if (!idea.groups.includes(group)) return -1;
    score += 4;
  }
  const real = moods.filter((m) => m !== "surprise");
  if (real.length) {
    const hits = real.filter((m) => idea.moods.includes(m)).length;
    if (hits === 0) return score > 0 ? score - 2 : -1;
    score += hits * 2;
  }
  return score;
}

/** Deterministic rotation so "Show me more ideas" keeps returning fresh picks. */
function rotate<T>(list: T[], seed: number): T[] {
  if (!list.length) return list;
  const offset = Math.abs(Math.trunc(seed)) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

/** The curated recommender used when no AI provider is configured. */
export function recommendFromRules(request: RecommendationRequest): ExperienceIdea[] {
  const moods = request.moods ?? [];
  const surprise = moods.includes("surprise");
  const limit = request.limit ?? 6;

  const scored = IDEA_POOL.map((idea) => ({ idea, score: scoreIdea(idea, request.group, moods) }))
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score);

  const pool = scored.length ? scored : IDEA_POOL.map((idea) => ({ idea, score: 0 }));
  const ordered = surprise
    ? rotate(pool, (request.seed ?? 0) * 3 + 1)
    : rotate(pool, request.seed ?? 0);

  return ordered.slice(0, limit).map((s) => s.idea);
}
