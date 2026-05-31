import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BarChart3, Brain, Gauge, Leaf, Sparkles, ShieldCheck, Zap, Star, Trees, Globe2,
  Flame, Car, PencilLine, LineChart, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/marketing-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TerraPulse — The Pulse of Your Planet Impact" },
      { name: "description", content: "Track your carbon footprint with real-time insights, analytics, and AI-powered sustainability recommendations." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Gauge, title: "Carbon Tracking", desc: "Log electricity, fuel, and travel in seconds. We compute your monthly footprint instantly." },
  { icon: BarChart3, title: "Sustainability Analytics", desc: "Premium charts reveal where your emissions come from and how they evolve over time." },
  { icon: Leaf, title: "Eco Score", desc: "A single number from 0–100 that captures your impact and motivates progress." },
  { icon: Brain, title: "AI Recommendations", desc: "Personalized, AI-generated tips tailored to the categories driving your footprint." },
];

const productHighlights = [
  { value: "3", label: "Emission categories tracked" },
  { value: "0–100", label: "Eco Score range" },
  { value: "AI", label: "Personalized insights" },
  { value: "PDF", label: "Exportable reports" },
];

const howItWorks = [
  { icon: PencilLine, title: "Enter Data", desc: "Log electricity, fuel, and travel for the month — no spreadsheets, no friction." },
  { icon: BarChart3, title: "Analyze Footprint", desc: "Instantly see your total CO₂, breakdown by source, and trend vs last month." },
  { icon: Brain, title: "Get AI Insights", desc: "Receive personalized, AI-generated recommendations for your top emission source." },
  { icon: Target, title: "Track Progress", desc: "Watch your Eco Score climb and total emissions fall, entry after entry." },
];

const testimonials = [
  { quote: "TerraPulse turned climate anxiety into climate action. The dashboard is genuinely beautiful.", name: "Amelia Chen", role: "Product Lead, Helio" },
  { quote: "It's the Stripe of climate tools — premium, fast, and the insights are sharp.", name: "Marcus Rivera", role: "Founder, NorthGrid" },
  { quote: "Our team uses TerraPulse weekly. The eco score is wildly addictive in the best way.", name: "Priya Natarajan", role: "Sustainability Officer, Linea" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4">
        <MarketingNav />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-12 pb-20 sm:pt-20 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10 gradient-hero" />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />

        <div className="mx-auto max-w-5xl text-center animate-fade-up">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary" />
            New · AI-powered sustainability insights
            <ArrowRight className="h-3 w-3" />
          </div>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            See Your Impact.<br />
            <span className="gradient-text">Shape a Greener Future.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            Track your carbon footprint with real-time insights, analytics, and AI-powered sustainability recommendations — built for people who want their actions to matter.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow h-12 px-6">
              <Link to="/signup">
                Sign Up Free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 glass">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure & private</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Real-time updates</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-primary" /> Science-based factors</span>
          </div>
        </div>

        {/* Live dashboard preview */}
        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-16">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] gradient-primary opacity-25 blur-3xl" />
          <div className="rounded-3xl border border-border glass p-2 shadow-card">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">How It Works</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">From data to action in four steps.</h2>
            <p className="mt-4 text-muted-foreground">Log once a month. Let TerraPulse handle the math, the analytics, and the AI insights.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
                <div className="absolute right-5 top-5 text-xs font-semibold text-muted-foreground/60">0{i + 1}</div>
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Features</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Everything you need to live lighter on the planet.</h2>
            <p className="mt-4 text-muted-foreground">From data entry to deep analytics and AI guidance — TerraPulse is a single, beautiful surface for understanding and reducing your footprint.</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full gradient-primary opacity-10 transition group-hover:opacity-25" />
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 text-xs text-muted-foreground/70">0{i + 1} / 04</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TerraPulse */}
      <section id="why" className="relative px-4 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 gradient-hero opacity-60" />
        <div className="mx-auto max-w-6xl rounded-3xl border border-border glass p-6 shadow-card sm:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-primary">Why TerraPulse</div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Climate action, designed like a product you love.</h2>
              <p className="mt-4 text-muted-foreground">We replaced spreadsheets and guilt with elegant analytics and clear next steps. Every interaction is built to make sustainable choices feel natural — and even rewarding.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {["Science-based emission factors", "Secure, user-owned data", "AI-personalized monthly insights", "Exportable PDF reports"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {productHighlights.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
                  <div className="text-3xl font-bold gradient-text sm:text-4xl">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Loved by changemakers</div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Built for the next generation of climate citizens.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-primary p-8 text-center shadow-glow sm:p-12">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
          <Trees className="mx-auto h-10 w-10 text-primary-foreground" />
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Start measuring what matters.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Join TerraPulse and lower your footprint with clarity, AI guidance, and confidence.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-6 shadow-card">
            <Link to="/signup">
              Sign Up Free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="h-4 w-4 text-primary" /> © {new Date().getFullYear()} TerraPulse. The Pulse of Your Planet Impact.
          </div>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Live-feeling dashboard preview --- */
function DashboardPreview() {
  const kpis = [
    { label: "Footprint", value: "412 kg", trend: "-12% MoM", color: "text-emerald-500" },
    { label: "Eco Score", value: "78", trend: "+6 pts", color: "text-teal-500" },
    { label: "Trees needed", value: "23", trend: "/year", color: "text-muted-foreground" },
    { label: "Earths needed", value: "1.4×", trend: "global avg 1.7×", color: "text-muted-foreground" },
  ];
  const breakdown = [
    { icon: Zap, label: "Electricity", pct: 48, value: "198 kg" },
    { icon: Flame, label: "Fuel", pct: 31, value: "128 kg" },
    { icon: Car, label: "Travel", pct: 21, value: "86 kg" },
  ];
  // Mini sparkline points (last 6 months, decreasing trend)
  const series = [88, 76, 80, 64, 58, 52];
  const max = Math.max(...series);
  const points = series
    .map((v, i) => `${(i / (series.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">This month</div>
          <div className="mt-0.5 text-base font-semibold">Your TerraPulse dashboard</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-emerald-500 animate-pulse" />
          Live data
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {kpis.map((s, i) => (
          <div key={s.label} className="rounded-xl bg-muted/40 p-3.5 animate-float sm:p-4" style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-xl font-semibold sm:text-2xl">{s.value}</div>
            <div className={`mt-0.5 text-[11px] ${s.color}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent p-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium">
              <LineChart className="h-3.5 w-3.5 text-primary" />
              Footprint trend · 6 months
            </div>
            <div className="text-[11px] text-emerald-500">↓ 40% since Jan</div>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-24 w-full">
            <defs>
              <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              vectorEffect="non-scaling-stroke"
            />
            <polygon
              fill="url(#spark)"
              points={`0,100 ${points} 100,100`}
            />
          </svg>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-4 lg:col-span-2">
          <div className="text-xs font-medium">Emission breakdown</div>
          <div className="mt-3 space-y-3">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5"><b.icon className="h-3 w-3 text-primary" />{b.label}</span>
                  <span className="text-muted-foreground">{b.value} · {b.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insight chip */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3.5">
        <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground">
          <Brain className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold">AI insight</div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Electricity is your largest source. Switching to LED + reducing AC runtime by 1°C could cut ~22 kg CO₂ next month.
          </p>
        </div>
      </div>
    </div>
  );
}
