import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function MarketingNav() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl glass px-4 py-2.5 shadow-card">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#why" className="transition hover:text-foreground">Why TerraPulse</a>
          <a href="#testimonials" className="transition hover:text-foreground">Testimonials</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <Button asChild size="sm" className="gradient-primary text-primary-foreground shadow-glow">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="gradient-primary text-primary-foreground shadow-glow">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
