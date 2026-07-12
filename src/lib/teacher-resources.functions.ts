import { createServerFn } from "@tanstack/react-start";

export interface GenerateResourceInput {
  type: string; // e.g. "lesson-plan", "worksheet", "quiz", "comprehension", "writing-prompt", "assembly-script", "display-idea"
  topic: string;
  yearGroup?: string; // e.g. "EYFS", "Year 3", "KS2"
  subject?: string;
  lengthMinutes?: number;
  audience?: string; // e.g. "small group", "whole class"
  notes?: string;
}

export interface GenerateResourceResult {
  title: string;
  html: string;
  raw: string;
}

const PROMPTS: Record<string, string> = {
  "lesson-plan":
    "You are an experienced UK primary school teacher creating a full Christmas-themed lesson plan. Produce learning objectives, success criteria, starter activity, main teaching input, differentiated activities (support/core/stretch), plenary, resources needed, and assessment opportunities.",
  worksheet:
    "You are creating a printable Christmas-themed worksheet for pupils. Include a title, brief instructions, then the questions or tasks laid out clearly. Number every question. Leave visible answer space (a line of underscores or a box) after each question. Include an ANSWERS section at the end.",
  quiz:
    "You are creating a Christmas-themed classroom quiz. Produce 15–25 numbered questions ranging in difficulty, followed by a clearly labelled ANSWERS section.",
  comprehension:
    "You are creating a Christmas-themed reading comprehension. First write a festive short passage of 200–400 words. Then produce 8–10 numbered comprehension questions of varying difficulty (retrieval, inference, vocabulary, author's choice). Finish with an ANSWERS section.",
  "writing-prompt":
    "You are creating a Christmas-themed creative writing pack. Include a vivid scenario, 3–5 supporting prompts, ambitious vocabulary list, sentence starters, and a success criteria checklist.",
  "assembly-script":
    "You are writing a warm, inclusive primary school Christmas assembly script. Include narrator lines, several speaking parts, stage directions, a suggested carol, and a short reflection at the end. Keep it non-denominational-friendly.",
  "display-idea":
    "You are describing a stunning classroom Christmas display idea. Provide a title, materials list, step-by-step build instructions, pupil-work suggestions, and a photograph description of the finished look.",
};

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return trimmed;
}

export const generateResource = createServerFn({ method: "POST" })
  .inputValidator((input: GenerateResourceInput) => {
    if (!input?.type || !input?.topic) throw new Error("Type and topic are required");
    return input;
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = PROMPTS[data.type] ?? PROMPTS["worksheet"];
    const yearGroup = data.yearGroup?.trim() || "Year 3";
    const subject = data.subject?.trim() || "Cross-curricular";
    const length = data.lengthMinutes ?? 30;
    const audience = data.audience?.trim() || "whole class";

    const userPrompt = [
      `Topic: ${data.topic}`,
      `Year group / age: ${yearGroup}`,
      `Subject: ${subject}`,
      `Approximate length: ${length} minutes`,
      `Audience: ${audience}`,
      data.notes ? `Extra notes: ${data.notes}` : null,
      "",
      "Return your response as valid, self-contained HTML (no <html>, <head>, or <body> tags — just the content).",
      "Use semantic tags: <h1> for the title, <h2> for sections, <p>, <ul>, <ol>, <table> as needed.",
      "Do NOT include CSS or inline styles. Do NOT wrap in a code fence.",
      "Start with a single <h1> that is the resource title.",
    ]
      .filter(Boolean)
      .join("\n");

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
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) throw new Error("The AI is very busy — please try again in a moment.");
      if (response.status === 402) throw new Error("Your Lovable AI credits are exhausted. Add credits to continue.");
      throw new Error(`AI request failed (${response.status}): ${text.slice(0, 200)}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const html = stripCodeFence(raw);

    // Extract title from first <h1>
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : data.topic;

    return { title, html, raw } satisfies GenerateResourceResult;
  });
