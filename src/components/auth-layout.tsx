import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import type { ReactNode } from "react";

export function AuthLayout({
  title, subtitle, children, footer,
}: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 gradient-hero" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link to="/" className="self-start"><Logo /></Link>
        <div className="my-auto">
          <div className="rounded-3xl border border-border glass p-8 shadow-card">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
