import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TerraPulse" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      const m = error.message?.toLowerCase() ?? "";
      const friendly = m.includes("invalid login")
        ? "Incorrect email or password."
        : m.includes("email not confirmed")
        ? "Please confirm your email before signing in."
        : error.message;
      toast.error(friendly);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  async function onGoogle() {
    setOauthLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) { toast.error(res.error.message); setOauthLoading(false); return; }
    if (!res.redirected) navigate({ to: "/dashboard" });
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your TerraPulse account."
      footer={<>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></>}
    >
      <Button onClick={onGoogle} disabled={oauthLoading} variant="outline" className="w-full">
        {oauthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />} Continue with Google
      </Button>
      <div className="relative my-6 text-center text-xs text-muted-foreground">
        <span className="bg-card px-3 relative z-10">or</span>
        <div className="absolute left-0 right-0 top-1/2 -z-0 border-t border-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <div className="flex justify-between"><Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">Forgot?</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 11v3.2h4.5c-.2 1.2-1.4 3.5-4.5 3.5-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.7 3.2 1.2l2.2-2.1C15.9 5.4 14.1 4.5 12 4.5 7.9 4.5 4.5 7.9 4.5 12s3.4 7.5 7.5 7.5c4.3 0 7.2-3 7.2-7.3 0-.5 0-.9-.1-1.2H12z"/>
    </svg>
  );
}
