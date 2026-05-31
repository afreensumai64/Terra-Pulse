import type { CarbonEntry } from "@/hooks/use-entries";

export type Trend = "improving" | "stable" | "increasing" | "none";

export interface DerivedStats {
  latest?: CarbonEntry;
  previous?: CarbonEntry;
  bestScore: number;
  bestScoreAt?: string;
  avgScore: number;
  totalReduced: number;
  trend: Trend;
  // monthly change (latest vs previous) in kg CO2; negative = improvement
  monthlyDelta: number;
  // % improvement (positive = better than previous month)
  improvementPct: number;
  count: number;
}

export function deriveStats(entries: CarbonEntry[]): DerivedStats {
  if (!entries.length) {
    return {
      bestScore: 0, avgScore: 0, totalReduced: 0,
      trend: "none", monthlyDelta: 0, improvementPct: 0, count: 0,
    };
  }
  const latest = entries[entries.length - 1];
  const previous = entries.length > 1 ? entries[entries.length - 2] : undefined;
  const scores = entries.map(e => Number(e.eco_score));
  const totals = entries.map(e => Number(e.total_emissions));
  const bestIdx = scores.indexOf(Math.max(...scores));
  const bestScore = scores[bestIdx];
  const bestScoreAt = entries[bestIdx]?.created_at;
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const totalReduced = Math.max(0, totals[0] - totals[totals.length - 1]);

  let trend: Trend = "stable";
  let monthlyDelta = 0;
  let improvementPct = 0;
  if (previous) {
    const prev = Number(previous.total_emissions);
    const cur = Number(latest.total_emissions);
    monthlyDelta = cur - prev;
    improvementPct = prev > 0 ? +(((prev - cur) / prev) * 100).toFixed(1) : 0;
    const ratio = prev > 0 ? Math.abs(monthlyDelta) / prev : 0;
    if (ratio < 0.02) trend = "stable";
    else if (monthlyDelta < 0) trend = "improving";
    else trend = "increasing";
  }

  return {
    latest, previous,
    bestScore, bestScoreAt, avgScore, totalReduced,
    trend, monthlyDelta, improvementPct,
    count: entries.length,
  };
}

export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
