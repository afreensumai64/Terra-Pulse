import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2, Flame, Zap, Car, Sparkles, TrendingDown, TrendingUp, Minus,
  Trees, Globe, Download, Target, Trophy, Clock, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateCarbon, ratingColor } from "@/lib/calculations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useEntries } from "@/hooks/use-entries";
import { useGoal } from "@/hooks/use-goal";
import { deriveStats, formatDateTime } from "@/lib/stats";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TerraPulse" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const entries = useEntries(user?.id);
  const [form, setForm] = useState({ electricity: "", fuel: "", travel: "" });
  const [saving, setSaving] = useState(false);
  const { goal, setGoal } = useGoal(user?.id);
  const prefilledRef = useRef(false);

  const stats = useMemo(() => deriveStats(entries.data ?? []), [entries.data]);
  const latest = stats.latest;

  // Auto-load the latest saved entry into the calculator (once per session/user)
  useEffect(() => {
    if (prefilledRef.current) return;
    if (!latest) return;
    prefilledRef.current = true;
    setForm({
      electricity: String(latest.electricity_usage ?? ""),
      fuel: String(latest.fuel_consumption ?? ""),
      travel: String(latest.travel_distance ?? ""),
    });
  }, [latest]);

  const preview = useMemo(() => calculateCarbon({
    electricity: Number(form.electricity) || 0,
    fuel: Number(form.fuel) || 0,
    travel: Number(form.travel) || 0,
  }), [form]);

  // Duplicate detection: identical inputs to latest entry
  const isDuplicate = useMemo(() => {
    if (!latest) return false;
    const e = Number(form.electricity) || 0;
    const f = Number(form.fuel) || 0;
    const t = Number(form.travel) || 0;
    return (
      Number(latest.electricity_usage) === e &&
      Number(latest.fuel_consumption) === f &&
      Number(latest.travel_distance) === t
    );
  }, [form, latest]);

  async function save() {
    if (!user || saving) return;
    if (isDuplicate) {
      toast.info("This entry matches your most recent save — no changes to record.");
      return;
    }
    const e = Number(form.electricity);
    const f = Number(form.fuel);
    const t = Number(form.travel);
    if ([e, f, t].some(v => !Number.isFinite(v) || v < 0)) {
      toast.error("Please enter valid non-negative numbers.");
      return;
    }
    setSaving(true);
    const r = preview;
    const { error } = await supabase.from("carbon_entries").insert({
      user_id: user.id,
      electricity_usage: e || 0,
      fuel_consumption: f || 0,
      travel_distance: t || 0,
      electricity_emissions: r.electricity_emissions,
      fuel_emissions: r.fuel_emissions,
      travel_emissions: r.travel_emissions,
      total_emissions: r.total_emissions,
      eco_score: r.eco_score,
      sustainability_rating: r.sustainability_rating,
      annual_projection: r.annual_projection,
      trees_needed: r.trees_needed,
      earths_needed: r.earths_needed,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Entry saved", { description: "Your dashboard, analytics, and impact are updated." });
    // Refresh all dependent views
    await qc.invalidateQueries({ queryKey: ["entries", user.id] });
  }

  function downloadPdf() {
    if (!latest) {
      toast.error("Save an entry first to generate a report.");
      return;
    }
    // Lazy import to keep initial bundle lean
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const name = (user?.user_metadata?.display_name as string) ?? user?.email ?? "TerraPulse user";
      let y = 56;
      doc.setFont("helvetica", "bold"); doc.setFontSize(22);
      doc.text("TerraPulse Carbon Report", 56, y); y += 28;
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(110);
      doc.text(`Prepared for: ${name}`, 56, y); y += 16;
      doc.text(`Generated: ${new Date().toLocaleString()}`, 56, y); y += 16;
      doc.text(`Last entry: ${formatDateTime(latest.created_at)}`, 56, y); y += 28;

      doc.setTextColor(20); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
      doc.text("Latest month", 56, y); y += 18;
      doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      const rows: [string, string][] = [
        ["Total CO2", `${Number(latest.total_emissions).toFixed(1)} kg`],
        ["Eco score", `${Math.round(Number(latest.eco_score))}/100 (${latest.sustainability_rating})`],
        ["Annual projection", `${Math.round(Number(latest.annual_projection)).toLocaleString()} kg / year`],
        ["Trees needed", `${Number(latest.trees_needed).toFixed(0)}`],
        ["Earths needed", `${Number(latest.earths_needed)}x`],
        ["Electricity", `${Number(latest.electricity_usage)} kWh -> ${Number(latest.electricity_emissions).toFixed(1)} kg`],
        ["Fuel", `${Number(latest.fuel_consumption)} L -> ${Number(latest.fuel_emissions).toFixed(1)} kg`],
        ["Travel", `${Number(latest.travel_distance)} km -> ${Number(latest.travel_emissions).toFixed(1)} kg`],
      ];
      for (const [k, v] of rows) { doc.text(`${k}: ${v}`, 56, y); y += 16; }

      y += 12;
      doc.setFont("helvetica", "bold"); doc.setFontSize(14);
      doc.text("Progress", 56, y); y += 18;
      doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      doc.text(`Entries logged: ${stats.count}`, 56, y); y += 16;
      doc.text(`Personal best eco score: ${Math.round(stats.bestScore)}/100`, 56, y); y += 16;
      doc.text(`Trend vs previous month: ${trendLabel(stats.trend)} (${stats.improvementPct >= 0 ? "+" : ""}${stats.improvementPct}%)`, 56, y); y += 16;
      doc.text(`Monthly goal: ${goal} kg CO2`, 56, y); y += 16;

      doc.save(`terrapulse-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded");
    }).catch(() => toast.error("Could not generate PDF"));
  }

  const goalProgress = latest
    ? Math.max(0, Math.min(100, Math.round((1 - Number(latest.total_emissions) / goal) * 100 + 100 - 100)))
    : 0;
  // simplified: percent of goal "used"
  const goalUsedPct = latest ? Math.min(200, Math.round((Number(latest.total_emissions) / goal) * 100)) : 0;
  const onTrack = latest ? Number(latest.total_emissions) <= goal : false;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Dashboard</div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Your monthly impact</h1>
            <p className="text-sm text-muted-foreground">Log this month's usage to see real-time emissions and your eco score.</p>
            {latest && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 text-primary" />
                Last updated {formatDateTime(latest.created_at)}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={downloadPdf} className="gap-2">
            <Download className="h-4 w-4" /> Download report
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total CO₂ this month"
            value={latest ? `${fmt(latest.total_emissions)} kg` : "—"}
            sub="Across all sources"
            icon={Flame}
            loading={entries.isLoading}
            tip="Sum of electricity, fuel, and travel emissions from your latest saved entry."
          />
          <StatCard
            label="Eco Score"
            value={latest ? `${Math.round(latest.eco_score)}/100` : "—"}
            sub={latest?.sustainability_rating ?? "No data yet"}
            icon={Sparkles}
            accent={latest ? ratingColor(latest.sustainability_rating as any) : ""}
            loading={entries.isLoading}
            tip="100 means zero emissions. Score drops to 0 at ≥ 1,000 kg CO₂ / month."
          />
          <StatCard
            label="Annual projection"
            value={latest ? `${fmt(latest.annual_projection)} kg` : "—"}
            sub="At current rate"
            icon={TrendingDown}
            loading={entries.isLoading}
            tip="Your latest monthly total × 12. Save more entries to see how this evolves."
          />
          <StatCard
            label="Earths needed"
            value={latest ? `${latest.earths_needed}×` : "—"}
            sub="If everyone lived like you"
            icon={Globe}
            loading={entries.isLoading}
            tip="Annual projection ÷ 2,000 kg (sustainable per-capita budget)."
          />
        </div>

        {/* Goal + trend + personal best */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4 text-primary" /> Monthly goal
                <InfoTip text="Your target maximum CO₂ per month. Stored locally per account." />
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number" min={1} value={goal}
                  onChange={(e) => setGoal(Number(e.target.value) || 1)}
                  className="h-7 w-20 text-right text-xs"
                />
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{latest ? `${fmt(latest.total_emissions)} / ${goal} kg used` : "No data yet"}</span>
                <span className={onTrack ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>
                  {latest ? (onTrack ? "On track" : "Over goal") : "—"}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${onTrack ? "gradient-primary" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(100, goalUsedPct)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendIcon trend={stats.trend} /> Trend vs previous month
              <InfoTip text="Compares your latest total emissions to the previous saved entry." />
            </div>
            {stats.previous ? (
              <>
                <div className="mt-3 text-2xl font-bold">
                  {stats.improvementPct >= 0 ? "+" : ""}{stats.improvementPct}%
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {trendLabel(stats.trend)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stats.monthlyDelta <= 0
                    ? `Down ${Math.abs(stats.monthlyDelta).toFixed(1)} kg vs last entry`
                    : `Up ${stats.monthlyDelta.toFixed(1)} kg vs last entry`}
                </div>
              </>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">Save a second entry to compare.</div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Trophy className="h-4 w-4 text-primary" /> Personal best
              <InfoTip text="Your highest eco score across all saved entries." />
            </div>
            {stats.count ? (
              <>
                <div className="mt-3 text-2xl font-bold">{Math.round(stats.bestScore)}<span className="text-sm font-normal text-muted-foreground">/100</span></div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Set on {formatDateTime(stats.bestScoreAt)}
                </div>
              </>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">No entries yet.</div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Calculator */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-3">
            <h2 className="text-lg font-semibold">Carbon Calculator</h2>
            <p className="text-sm text-muted-foreground">Enter your monthly totals below. Values from your last entry are pre-filled.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Field id="electricity" label="Electricity (kWh)" icon={Zap} value={form.electricity}
                onChange={(v) => setForm({ ...form, electricity: v })} />
              <Field id="fuel" label="Fuel (Liters)" icon={Flame} value={form.fuel}
                onChange={(v) => setForm({ ...form, fuel: v })} />
              <Field id="travel" label="Travel (KM)" icon={Car} value={form.travel}
                onChange={(v) => setForm({ ...form, travel: v })} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Breakdown label="Electricity CO₂" value={preview.electricity_emissions} />
              <Breakdown label="Fuel CO₂" value={preview.fuel_emissions} />
              <Breakdown label="Travel CO₂" value={preview.travel_emissions} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={save}
                disabled={saving || isDuplicate}
                className="gradient-primary text-primary-foreground shadow-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save this month's entry"}
              </Button>
              {isDuplicate && (
                <span className="text-xs text-muted-foreground">
                  Matches your last entry — change a value to save again.
                </span>
              )}
            </div>
          </div>

          {/* Live result */}
          <div className="rounded-3xl border border-border glass p-6 shadow-card lg:col-span-2">
            <h2 className="text-lg font-semibold">Live preview</h2>
            <div className="mt-6">
              <div className="text-sm text-muted-foreground">Total monthly footprint</div>
              <div className="mt-1 text-5xl font-bold gradient-text">{fmt(preview.total_emissions)}<span className="ml-1 text-xl text-muted-foreground">kg CO₂</span></div>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-baseline justify-between">
                <div className="text-sm text-muted-foreground">Eco Score</div>
                <div className={`text-sm font-medium ${ratingColor(preview.sustainability_rating)}`}>{preview.sustainability_rating}</div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full gradient-primary transition-all" style={{ width: `${preview.eco_score}%` }} />
              </div>
              <div className="mt-2 text-3xl font-bold">{preview.eco_score}<span className="text-base font-normal text-muted-foreground">/100</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Mini icon={Trees} label="Trees needed" value={preview.trees_needed} tip="Annual CO₂ ÷ 21 kg absorbed per tree per year." />
              <Mini icon={Globe} label="Earths needed" value={`${preview.earths_needed}×`} tip="Annual CO₂ ÷ 2,000 kg sustainable budget." />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function trendLabel(t: ReturnType<typeof deriveStats>["trend"]) {
  switch (t) {
    case "improving": return "Improving";
    case "increasing": return "Increasing";
    case "stable": return "Stable";
    default: return "—";
  }
}

function TrendIcon({ trend }: { trend: ReturnType<typeof deriveStats>["trend"] }) {
  if (trend === "improving") return <TrendingDown className="h-4 w-4 text-emerald-500" />;
  if (trend === "increasing") return <TrendingUp className="h-4 w-4 text-amber-500" />;
  return <Minus className="h-4 w-4 text-primary" />;
}

function fmt(n: number | string) { return Math.round(Number(n)).toLocaleString(); }

function Field({ id, label, icon: Icon, value, onChange }: { id: string; label: string; icon: any; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </Label>
      <Input id={id} type="number" min={0} inputMode="decimal" placeholder="0" value={value}
        onChange={(e) => onChange(e.target.value)} className="mt-1.5 text-lg" />
    </div>
  );
}

function Breakdown({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">kg</span></div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent, loading, tip }: { label: string; value: string; sub: string; icon: any; accent?: string; loading?: boolean; tip?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full gradient-primary opacity-10 transition group-hover:opacity-20" />
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {label}{tip && <InfoTip text={tip} />}
        </span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      {loading ? <Skeleton className="mt-3 h-8 w-24" /> : <div className="mt-2 text-2xl font-bold">{value}</div>}
      <div className={`mt-1 text-xs ${accent ?? "text-muted-foreground"}`}>{sub}</div>
    </div>
  );
}

function Mini({ icon: Icon, label, value, tip }: { icon: any; label: string; value: any; tip?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />{label}
        {tip && <InfoTip text={tip} />}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label="More info" className="inline-flex">
          <Info className="h-3 w-3 text-muted-foreground/70 hover:text-primary" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  );
}
