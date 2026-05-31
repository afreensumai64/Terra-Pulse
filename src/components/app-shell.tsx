import { Link, Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { BarChart3, Gauge, Leaf, LogOut, Sparkles, Trees, User as UserIcon } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/impact", label: "Impact", icon: Trees },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

export function AppShell() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            Pulse of your planet impact
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block text-sm text-muted-foreground">
            Welcome back, <span className="text-foreground font-medium">{user?.user_metadata?.display_name ?? user?.email?.split("@")[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await signOut();
                router.navigate({ to: "/" });
              }}
              aria-label="Sign out"
              className="rounded-full"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl glass px-2 py-2 shadow-card lg:hidden">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`grid h-10 w-12 place-items-center rounded-xl text-xs transition ${
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>

        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
