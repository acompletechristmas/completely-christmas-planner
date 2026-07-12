import { createServerFn } from "@tanstack/react-start";

export interface SuggestGiftIdeasInput {
  name: string;
  relationship?: string | null;
  age?: number | null;
  hobbies?: string | null;
  favouriteShops?: string | null;
  favouriteColours?: string | null;
  favouriteFilms?: string | null;
  favouriteBooks?: string | null;
  favouriteGames?: string | null;
  favouriteCharacters?: string | null;
  clothingSize?: string | null;
  shoeSize?: string | null;
  wishlist?: string | null;
  notes?: string | null;
  budget?: number | null;
  avoid?: string[]; // items already bought / previous years
}

export interface GiftIdea {
  item: string;
  reason: string;
  estimatedPrice: number | null;
}

export const suggestGiftIdeas = createServerFn({ method: "POST" })
  .inputValidator((input: SuggestGiftIdeasInput) => {
    if (!input?.name) throw new Error("Name is required");
    return input;
  })
  .handler(async ({ data }): Promise<GiftIdea[]> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const budgetLine = data.budget ? `Budget: around £${data.budget}` : "Budget: reasonable / mid-range";
    const facts = [
      `Name: ${data.name}`,
      data.relationship ? `Relationship: ${data.relationship}` : null,
      data.age != null ? `Age: ${data.age}` : null,
      data.hobbies ? `Hobbies: ${data.hobbies}` : null,
      data.favouriteShops ? `Favourite shops: ${data.favouriteShops}` : null,
      data.favouriteColours ? `Favourite colours: ${data.favouriteColours}` : null,
      data.favouriteFilms ? `Favourite films: ${data.favouriteFilms}` : null,
      data.favouriteBooks ? `Favourite books: ${data.favouriteBooks}` : null,
      data.favouriteGames ? `Favourite games: ${data.favouriteGames}` : null,
      data.favouriteCharacters ? `Favourite characters: ${data.favouriteCharacters}` : null,
      data.clothingSize ? `Clothing size: ${data.clothingSize}` : null,
      data.shoeSize ? `Shoe size: ${data.shoeSize}` : null,
      data.wishlist ? `Wishlist notes: ${data.wishlist}` : null,
      data.notes ? `Other notes: ${data.notes}` : null,
      budgetLine,
      data.avoid && data.avoid.length ? `Avoid suggesting these (already considered or bought previously): ${data.avoid.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const system =
      "You are a warm, thoughtful UK-based Christmas gift expert. Suggest specific, real, giftable ideas — not vague categories. Be creative but practical, and match the person's interests and budget. Prices in GBP.";

    const userPrompt = `Suggest 6 Christmas gift ideas for this person.\n\n${facts}\n\nReturn ONLY valid JSON, no code fences, matching this exact shape:\n{\n  "ideas": [\n    { "item": "specific gift name", "reason": "one warm sentence why it suits them", "estimatedPrice": 25 }\n  ]\n}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) throw new Error("Lots of people asking Santa at once — try again in a moment.");
      if (response.status === 402) throw new Error("AI credits are exhausted. Add credits to keep the ideas flowing.");
      throw new Error(`AI request failed (${response.status}): ${text.slice(0, 200)}`);
    }

    const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    let parsed: { ideas?: GiftIdea[] } = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Couldn't understand the AI response — please try again.");
    }
    const ideas = Array.isArray(parsed.ideas) ? parsed.ideas.slice(0, 8) : [];
    return ideas.map((i) => ({
      item: String(i.item ?? "").slice(0, 200),
      reason: String(i.reason ?? "").slice(0, 300),
      estimatedPrice: typeof i.estimatedPrice === "number" ? i.estimatedPrice : null,
    }));
  });
