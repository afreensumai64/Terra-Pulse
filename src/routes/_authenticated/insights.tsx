import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Zap, Flame, Car, Sparkles, Leaf, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { deriveStats } from "@/lib/stats";

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

  // Use a rolling window (last 3 entries) to rank sources — more stable than latest only
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
