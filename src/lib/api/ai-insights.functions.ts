import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  electricity: z.number().nonnegative(),
  fuel: z.number().nonnegative(),
  travel: z.number().nonnegative(),
  total: z.number().nonnegative(),
  ecoScore: z.number().min(0).max(100),
  trend: z.enum(["improving", "stable", "increasing", "none"]),
  topSource: z.enum(["electricity", "fuel", "travel"]).optional(),
});

export type AIInsight = {
  headline: string;
  summary: string;
  tips: { title: string; detail: string; impact: "high" | "medium" | "low" }[];
  opportunity: string;
};

export type AIInsightsResult =
  | { ok: true; insights: AIInsight; model: string }
  | { ok: false; reason: "not_configured" | "rate_limited" | "credits" | "error"; message: string };

export const generateAIInsights = createServerFn({ method: "POST" })
  .inputValidator(InputSchema)
  .handler(async ({ data }): Promise<AIInsightsResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false, reason: "not_configured", message: "AI insights are not configured." };
    }

    const systemPrompt =
      "You are a concise, friendly sustainability coach. Generate personalized, realistic, science-based recommendations for a user based on their carbon footprint data. Focus on the highest-impact actions for their top emission source. Keep tips actionable and specific.";

    const userPrompt = `User footprint (kg CO2 this month):
- Electricity: ${data.electricity.toFixed(1)}
- Fuel: ${data.fuel.toFixed(1)}
- Travel: ${data.travel.toFixed(1)}
- Total: ${data.total.toFixed(1)}
- Eco Score: ${data.ecoScore}/100
- Trend vs last month: ${data.trend}
- Top emission source: ${data.topSource ?? "n/a"}

Generate a brief headline, a 1-2 sentence summary, 4 personalized tips (each with title, short detail, and impact), and one reduction opportunity tailored to their top source.`;

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "render_insights",
                description: "Return personalized sustainability insights.",
                parameters: {
                  type: "object",
                  properties: {
                    headline: { type: "string" },
                    summary: { type: "string" },
                    tips: {
                      type: "array",
                      minItems: 3,
                      maxItems: 5,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          detail: { type: "string" },
                          impact: { type: "string", enum: ["high", "medium", "low"] },
                        },
                        required: ["title", "detail", "impact"],
                        additionalProperties: false,
                      },
                    },
                    opportunity: { type: "string" },
                  },
                  required: ["headline", "summary", "tips", "opportunity"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "render_insights" } },
        }),
      });

      if (response.status === 429) {
        return { ok: false, reason: "rate_limited", message: "AI is busy right now. Try again shortly." };
      }
      if (response.status === 402) {
        return { ok: false, reason: "credits", message: "AI credits exhausted. Add credits in workspace settings." };
      }
      if (!response.ok) {
        return { ok: false, reason: "error", message: `AI gateway error (${response.status}).` };
      }

      const json = await response.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments;
      if (!args) return { ok: false, reason: "error", message: "AI returned no structured insights." };

      const parsed = JSON.parse(args) as AIInsight;
      return { ok: true, insights: parsed, model: json.model ?? "ai" };
    } catch (err) {
      console.error("AI insights failed:", err);
      return { ok: false, reason: "error", message: "Failed to generate AI insights." };
    }
  });
