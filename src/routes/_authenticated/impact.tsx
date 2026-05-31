import { createFileRoute } from "@tanstack/react-router";
import { Trees, Car, Plane, Globe, TrendingDown } from "lucide-react";
import { useEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/impact")({
  head: () => ({ meta: [{ title: "Impact — TerraPulse" }] }),
  component: Impact,
});

// Reference factors
const CAR_KG_PER_YEAR = 4600; // avg passenger car
const FLIGHT_KG_SHORTHAUL = 250; // per short-haul flight

function Impact() {
  const { user } = useAuth();
  const { data: entries = [], isLoading } = useEntries(user?.id);
  const latest = entries[entries.length - 1];

  if (isLoading) return <Skeleton className="mx-auto h-96 max-w-5xl" />;
  if (!latest) return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border glass p-12 text-center shadow-card">
      <h2 className="text-xl font-semibold">Your impact at a glance</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">Save an entry on the Dashboard to see your annual impact.</p>
    </div>
  );

  const annual = Number(latest.annual_projection);
  const trees = Number(latest.trees_needed);
  const earths = Number(latest.earths_needed);
  const cars = annual / CAR_KG_PER_YEAR;
  const flights = annual / FLIGHT_KG_SHORTHAUL;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Impact</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your planetary footprint</h1>
        <p className="text-sm text-muted-foreground">If your current rate continues for a full year.</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-card">
        <div className="pointer-events-none absolute inset-0 -z-0 gradient-hero opacity-40" />
        <div className="relative">
          <div className="text-sm text-muted-foreground">Annual carbon projection</div>
          <div className="mt-2 text-6xl font-bold tracking-tight gradient-text sm:text-7xl">{Math.round(annual).toLocaleString()}<span className="ml-2 text-2xl text-muted-foreground">kg CO₂ / year</span></div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Big icon={Trees} label="Trees to offset" value={trees.toFixed(0)} sub="Required to absorb your annual CO₂" />
        <Big icon={Car} label="Cars equivalent" value={cars.toFixed(1)} sub="Avg cars driven for a year" />
        <Big icon={Plane} label="Flights equivalent" value={flights.toFixed(0)} sub="Short-haul flights" />
        <Big icon={Globe} label="Earths needed" value={`${earths}×`} sub="If everyone lived like you" />
      </div>

      <div className="rounded-3xl border border-border glass p-6 shadow-card">
        <div className="flex items-center gap-3"><TrendingDown className="h-5 w-5 text-primary" /><h3 className="font-semibold">Your reduction journey</h3></div>
        <p className="mt-2 text-sm text-muted-foreground">A 10% cut to your monthly footprint compounds to <span className="font-semibold text-foreground">{Math.round(annual * 0.1).toLocaleString()} kg CO₂</span> avoided annually — the equivalent of planting {Math.round((annual * 0.1) / 21)} trees.</p>
      </div>
    </div>
  );
}

function Big({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full gradient-primary opacity-10 transition group-hover:opacity-25" />
      <Icon className="h-6 w-6 text-primary" />
      <div className="mt-5 text-4xl font-bold">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
