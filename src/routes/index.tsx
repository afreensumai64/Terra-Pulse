import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BarChart3, Brain, Gauge, Leaf, Sparkles, ShieldCheck, Zap, Star, Trees, Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/marketing-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TerraPulse — The Pulse of Your Planet Impact" },
      { name: "description", content: "Track your carbon footprint with real-time insights, analytics, and sustainability recommendations." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Gauge, title: "Carbon Tracking", desc: "Log electricity, fuel, and travel in seconds. We compute your monthly footprint instantly." },
  { icon: BarChart3, title: "Sustainability Analytics", desc: "Premium charts reveal where your emissions come from and how they evolve over time." },
  { icon: Leaf, title: "Eco Score", desc: "A single number from 0–100 that captures your impact and motivates progress." },
  { icon: Brain, title: "Personalized Recommendations", desc: "Smart, actionable nudges tailored to the categories driving your footprint." },
];

const stats = [
  { value: "2.4M", label: "Tonnes CO₂ tracked" },
  { value: "180k", label: "Active members" },
  { value: "92%", label: "Reduce within 6 months" },
  { value: "48", label: "Countries" },
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
      <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 gradient-hero" />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />

        <div className="mx-auto max-w-5xl text-center animate-fade-up">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-primary" />
            New · Real-time emissions modeling
            <ArrowRight className="h-3 w-3" />
          </div>
          <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-7xl">
            See Your Impact.<br />
            <span className="gradient-text">Shape a Greener Future.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Track your carbon footprint with real-time insights, analytics, and sustainability recommendations — built for people who want their actions to matter.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-glow h-12 px-6">
              <Link to="/signup">
                Calculate My Impact
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 glass">
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Bank-grade security</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Real-time updates</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-primary" /> Science-based factors</span>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] gradient-primary opacity-25 blur-3xl" />
          <div className="rounded-3xl border border-border glass p-2 shadow-card">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: "Footprint", value: "412 kg", trend: "-12%", color: "text-emerald-500" },
                  { label: "Eco Score", value: "78", trend: "+6", color: "text-teal-500" },
                  { label: "Trees needed", value: "23", trend: "/year", color: "text-muted-foreground" },
                  { label: "Earths needed", value: "1.4×", trend: "global avg 1.7×", color: "text-muted-foreground" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl bg-muted/40 p-4 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-2xl font-semibold">{s.value}</div>
                    <div className={`mt-0.5 text-xs ${s.color}`}>{s.trend}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-32 rounded-xl bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Features</div>
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to live lighter on the planet.</h2>
            <p className="mt-4 text-muted-foreground">From data entry to deep analytics — TerraPulse is a single, beautiful surface for understanding and reducing your footprint.</p>
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
      <section id="why" className="relative px-4 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 gradient-hero opacity-60" />
        <div className="mx-auto max-w-6xl rounded-3xl border border-border glass p-10 shadow-card">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-primary">Why TerraPulse</div>
              <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Climate action, designed like a product you love.</h2>
              <p className="mt-4 text-muted-foreground">We replaced spreadsheets and guilt with elegant analytics and clear next steps. Every interaction is built to make sustainable choices feel natural — and even rewarding.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {["Science-based emission factors", "Encrypted, user-owned data", "Personalized monthly insights", "Offline-friendly, mobile-first"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="text-4xl font-bold gradient-text">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Loved by changemakers</div>
            <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Built for the next generation of climate citizens.</h2>
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
      <section className="px-4 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-primary p-12 text-center shadow-glow">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
          <Trees className="mx-auto h-10 w-10 text-primary-foreground" />
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Start measuring what matters.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Join thousands using TerraPulse to lower their footprint with clarity and confidence.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-6 shadow-card">
            <Link to="/signup">
              Get started free
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
