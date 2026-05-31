import { createFileRoute } from "@tanstack/react-router";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend, AreaChart, Area,
} from "recharts";
import { useEntries } from "@/hooks/use-entries";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TerraPulse" }] }),
  component: Analytics,
});

const COLORS = ["oklch(0.62 0.16 160)", "oklch(0.7 0.13 195)", "oklch(0.55 0.13 220)"];

function Analytics() {
  const { user } = useAuth();
  const { data: entries = [], isLoading } = useEntries(user?.id);
  const latest = entries[entries.length - 1];

  const pieData = latest ? [
    { name: "Electricity", value: latest.electricity_emissions },
    { name: "Fuel", value: latest.fuel_emissions },
    { name: "Travel", value: latest.travel_emissions },
  ] : [];

  const trend = entries.map((e, i) => ({
    name: `#${i + 1}`,
    total: Number(e.total_emissions),
    score: Number(e.eco_score),
  }));

  const reduction = entries.length > 1
    ? Math.round(((Number(entries[0].total_emissions) - Number(latest!.total_emissions)) / Number(entries[0].total_emissions || 1)) * 100)
    : 0;

  if (isLoading) {
    return <div className="mx-auto max-w-7xl space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-80 w-full" /></div>;
  }

  if (!entries.length) return <EmptyAnalytics />;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Analytics</div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your emissions, visualized</h1>
        <p className="text-sm text-muted-foreground">{entries.length} entries · {reduction >= 0 ? `${reduction}% reduction` : `${Math.abs(reduction)}% increase`} since first record</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Emission source distribution" subtitle="Latest entry breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly footprint trend" subtitle="Total kg CO₂ per entry">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.16 160)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.62 0.16 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 200 / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
              <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="total" stroke="oklch(0.62 0.16 160)" fill="url(#g1)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category comparison" subtitle="Latest entry by source">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 200 / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
              <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Eco Score performance" subtitle="Over time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 200 / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" opacity={0.5} fontSize={12} />
              <YAxis domain={[0, 100]} stroke="currentColor" opacity={0.5} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="oklch(0.7 0.13 195)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyAnalytics() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-border glass p-12 text-center shadow-card">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-primary shadow-glow">
          📊
        </div>
        <h2 className="mt-4 text-xl font-semibold">No data yet</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Add your first carbon entry on the Dashboard to unlock analytics.</p>
      </div>
    </div>
  );
}
