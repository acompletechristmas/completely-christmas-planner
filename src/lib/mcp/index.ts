import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPeople from "./tools/list-people";
import listGifts from "./tools/list-gifts";
import addGiftIdea from "./tools/add-gift-idea";
import listReminders from "./tools/list-reminders";

// OAuth issuer must be the direct supabase.co host (not the .lovable.cloud proxy).
// The project ref is inlined at build time via VITE_SUPABASE_PROJECT_ID.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "a-complete-christmas-mcp",
  title: "A Complete Christmas",
  version: "0.1.0",
  instructions:
    "Tools for A Complete Christmas — the signed-in user's Christmas planner. Use list_people to see who they're buying for, list_gifts to see gift status, add_gift_idea to save new ideas, and list_reminders for upcoming festive nudges.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listPeople, listGifts, addGiftIdea, listReminders],
});
