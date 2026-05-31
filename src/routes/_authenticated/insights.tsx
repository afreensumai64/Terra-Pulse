import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Zap, Flame, Car, Sparkles, Leaf, TrendingDown, TrendingUp, Minus, Brain, Loader2, AlertCircle } from "lucide-react";
import { useEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { deriveStats } from "@/lib/stats";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { generateAIInsights, type AIInsightsResult } from "@/lib/api/ai-insights.functions";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "Insights — TerraPulse" }] }),
  component: Insights,
});

const INSIGHTS = {
  electricity: {
    icon: Zap,
    title: "Reduce your electricity load",
    actions: ["Switch to LED lighting", "Reduce AC runtime by 1°C", "Use efficient appliances", "Run dishwasher / laundry full"],
  },
  fuel: {
    icon: Flame,
    title: "Cut fossil fuel use",
    actions: ["Carpool with colleagues", "Use public transport once a week", "Plan errands to combine trips", "Transition to a hybrid or EV"],
  },
  travel: {
    icon: Car,
    title: "Smarter travel choices",
    actions: ["Adopt 2-day hybrid work week", "Cycle short trips under 5 km", "Walk whenever possible", "Choose direct flights when needed"],
  },
};

function Insights() {
  const { user } = useAuth();
  const { data: entries = [], isLoading } = useEntries(user?.id);
  const stats = useMemo(() => deriveStats(entries), [entries]);
  const latest = stats.latest;

  const ranked = useMemo(() => {
    if (!entries.length) return [];
    const window = entries.slice(-3);
    const avg = (k: keyof typeof entries[number]) =>
      window.reduce((s, e) => s + Number(e[k] ?? 0), 0) / window.length;
    return [
      { key: "electricity" as const, value: avg("electricity_emissions") },
      { key: "fuel" as const, value: avg("fuel_emissions") },
      { key: "travel" as const, value: avg("travel_emissions") },
    ].sort((a, b) => b.value - a.value);
  }, [entries]);

  const generate = useServerFn(generateAIInsights);
  const aiMutation = useMutation<AIInsightsResult, Error, void>({
    mutationFn: async () => {
      if (!latest || !ranked.length) throw new Error("No data");
      return generate({
        data: {
          electricity: Number(latest.electricity_emissions ?? 0),
          fuel: Number(latest.fuel_emissions ?? 0),
          travel: Number(latest.travel_emissions ?? 0),
          total: Number(latest.total_emissions ?? 0),
          ecoScore: Number(latest.eco_score ?? 0),
          trend: stats.trend,
          topSource: ranked[0]?.key,
        },
      });
    },
  });

  if (isLoading) return <Skeleton className="mx-auto h-96 max-w-5xl" />;
  if (!latest) return <Empty />;

  const trendCopy =
    stats.trend === "improving"
      ? `You're trending down ${Math.abs(stats.improvementPct)}% vs last month — keep going.`
      : stats.trend === "increasing"
      ? `Your footprint rose ${stats.improvementPct < 0 ? Math.abs(stats.improvementPct) : stats.improvementPct}% vs last month — focus on the top source below.`
      : stats.previous
      ? "Your footprint is stable. A small habit change could unlock the next improvement."
      : "Save another entry to see how your habits are trending.";
  const TrendIcon = stats.trend === "improving" ? TrendingDown : stats.trend === "increasing" ? TrendingUp : Minus;

  const aiResult = aiMutation.data;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Insights</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Personalized recommendations</h1>
        <p className="text-sm text-muted-foreground">Based on your last {Math.min(3, entries.length)} {entries.length === 1 ? "entry" : "entries"}. Focus on the top source first.</p>
      </div>

      <div className="rounded-2xl border border-border glass p-5 shadow-card">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendIcon className={`h-4 w-4 ${stats.trend === "improving" ? "text-emerald-500" : stats.trend === "increasing" ? "text-amber-500" : "text-primary"}`} />
          Your trend
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{trendCopy}</p>
      </div>

      {/* AI Sustainability Insights */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full gradient-primary opacity-10" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Sustainability Insights</h2>
              <p className="mt-1 text-sm text-muted-foreground">Personalized recommendations generated from your latest footprint data.</p>
            </div>
          </div>
          <Button
            onClick={() => aiMutation.mutate()}
            disabled={aiMutation.isPending}
            className="gradient-primary text-primary-foreground shadow-glow"
          >
            {aiMutation.isPending ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="mr-1.5 h-4 w-4" /> {aiResult ? "Regenerate" : "Generate AI Insights"}</>
            )}
          </Button>
        </div>

        {aiMutation.isError && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">Couldn't reach the AI service. Your standard recommendations below are still active.</span>
          </div>
        )}

        {aiResult && !aiResult.ok && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
            <span className="text-muted-foreground">
              {aiResult.reason === "not_configured"
                ? "AI insights aren't configured yet. The standard recommendations below remain available."
                : aiResult.message}
            </span>
          </div>
        )}

        {aiResult && aiResult.ok && (
          <div className="mt-6 space-y-5">
            <div>
              <h3 className="text-base font-semibold">{aiResult.insights.headline}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{aiResult.insights.summary}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {aiResult.insights.tips.map((tip, i) => (
                <div key={i} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{tip.title}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      tip.impact === "high" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      tip.impact === "medium" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      "bg-muted text-muted-foreground"
                    }`}>{tip.impact}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tip.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-primary">Top opportunity</div>
              <p className="mt-1 text-sm">{aiResult.insights.opportunity}</p>
            </div>
          </div>
        )}

        {!aiResult && !aiMutation.isPending && !aiMutation.isError && (
          <p className="mt-5 text-xs text-muted-foreground">Generate a tailored AI plan based on this month's electricity, fuel, and travel data.</p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {ranked.map((r, idx) => {
          const ins = INSIGHTS[r.key];
          const Icon = ins.icon;
          return (
            <div key={r.key} className={`relative overflow-hidden rounded-3xl border border-border p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow ${idx === 0 ? "bg-card" : "bg-card/60"}`}>
              {idx === 0 && (
                <div className="absolute right-4 top-4 rounded-full gradient-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Top priority</div>
              )}
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{ins.title}</h3>
              <div className="mt-1 text-xs text-muted-foreground">{r.value.toFixed(1)} kg CO₂ avg from this source</div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {ins.actions.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-border glass p-6 shadow-card">
        <div className="flex items-center gap-3">
          <Leaf className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Quick win this month</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Apply one habit from your top priority for 30 days. Most TerraPulse members see a 8–15% reduction in their next entry.
        </p>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border glass p-12 text-center shadow-card">
      <h2 className="text-xl font-semibold">Insights unlock with data</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">Log an entry on the Dashboard to receive tailored recommendations.</p>
    </div>
  );
}
