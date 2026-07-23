import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function client(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "add_gift_idea",
  title: "Add gift idea",
  description: "Add a new gift idea to the signed-in user's planner for a specific person.",
  inputSchema: {
    person_id: z.string().uuid().describe("The recipient's person ID (from list_people)."),
    item: z.string().min(1).describe("Short description of the gift."),
    price: z.number().nonnegative().optional().describe("Estimated price in the user's currency."),
    url: z.string().url().optional().describe("Optional link to where to buy."),
    notes: z.string().optional(),
    year: z.number().int().min(2000).max(2100).optional().describe("Christmas year (defaults to current year)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ person_id, item, price, url, notes, year }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = client(ctx);
    const { data: person, error: pErr } = await supabase
      .from("people")
      .select("id, name")
      .eq("id", person_id)
      .maybeSingle();
    if (pErr || !person) {
      return { content: [{ type: "text", text: "Person not found" }], isError: true };
    }
    const { data, error } = await supabase
      .from("person_gifts")
      .insert({
        user_id: ctx.getUserId(),
        person_id,
        recipient: person.name,
        item,
        price: price ?? null,
        url: url ?? null,
        notes: notes ?? null,
        status: "idea",
        year: year ?? new Date().getFullYear(),
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Added "${item}" for ${person.name}.` }],
      structuredContent: { gift: data },
    };
  },
});
