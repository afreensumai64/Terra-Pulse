import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Award, Flame, Leaf, Sparkles, Trophy, TrendingDown } from "lucide-react";
import { useEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — TerraPulse" }] }),
  component: Profile,
});

const BADGES = [
  { key: "beginner", title: "Eco Beginner", desc: "Logged your first entry", icon: Leaf, threshold: 1 },
  { key: "explorer", title: "Green Explorer", desc: "Logged 3 entries", icon: Sparkles, threshold: 3 },
  { key: "champion", title: "Sustainability Champion", desc: "Reached eco score 70+", icon: Trophy, scoreThreshold: 70 },
  { key: "guardian", title: "Earth Guardian", desc: "Reached eco score 85+", icon: Award, scoreThreshold: 85 },
];

function Profile() {
  const { user } = useAuth();
  const { data: entries = [], isLoading } = useEntries(user?.id);

  const stats = useMemo(() => {
    if (!entries.length) return null;
    const scores = entries.map(e => Number(e.eco_score));
    const totals = entries.map(e => Number(e.total_emissions));
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bestIdx = scores.indexOf(Math.max(...scores));
    const reduced = totals[0] - totals[totals.length - 1];
    const bestScore = scores[bestIdx];
    return { avg, bestScore, reduced, count: entries.length };
  }, [entries]);

  if (isLoading) return <Skeleton className="mx-auto h-96 max-w-5xl" />;

  const name = (user?.user_metadata?.display_name as string) ?? user?.email?.split("@")[0] ?? "You";
  const initials = name.slice(0, 2).toUpperCase();
  const maxScore = stats?.bestScore ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="pointer-events-none absolute inset-0 -z-0 gradient-hero opacity-40" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl gradient-primary text-2xl font-bold text-primary-foreground shadow-glow">{initials}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-xs">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary" />
              {stats ? `${stats.count} entries logged` : "No entries yet"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Sparkles} label="Average eco score" value={stats ? stats.avg.toFixed(0) : "—"} />
        <Stat icon={Trophy} label="Best eco month" value={stats ? stats.bestScore.toFixed(0) : "—"} />
        <Stat icon={Flame} label="Sustainability streak" value={stats ? `${stats.count} mo` : "0"} />
        <Stat icon={TrendingDown} label="Total emissions reduced" value={stats ? `${Math.max(0, Math.round(stats.reduced))} kg` : "—"} />
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight">Achievements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => {
            const unlocked = b.threshold ? entries.length >= b.threshold : maxScore >= (b.scoreThreshold ?? 9999);
            const Icon = b.icon;
            return (
              <div key={b.key} className={`relative overflow-hidden rounded-2xl border border-border p-5 shadow-card transition ${unlocked ? "bg-card" : "bg-card/50 opacity-60"}`}>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${unlocked ? "gradient-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold">{b.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{b.desc}</div>
                <div className={`mt-3 text-[10px] font-semibold uppercase tracking-wider ${unlocked ? "text-primary" : "text-muted-foreground"}`}>
                  {unlocked ? "Unlocked" : "Locked"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
