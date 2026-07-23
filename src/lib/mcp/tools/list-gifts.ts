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
  name: "list_gifts",
  title: "List gifts",
  description: "List Christmas gifts for the signed-in user. Optionally filter by year, person, or status.",
  inputSchema: {
    year: z.number().int().min(2000).max(2100).optional().describe("Christmas year (defaults to current year)."),
    person_id: z.string().uuid().optional().describe("Only gifts for this person."),
    status: z.enum(["idea", "bought", "wrapped", "given"]).optional().describe("Only gifts in this status."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ year, person_id, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = client(ctx)
      .from("person_gifts")
      .select("id, person_id, recipient, item, price, status, wrapped, year, notes, url")
      .eq("year", year ?? new Date().getFullYear());
    if (person_id) q = q.eq("person_id", person_id);
    if (status) q = q.eq("status", status);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { gifts: data ?? [] },
    };
  },
});
