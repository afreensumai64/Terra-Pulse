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

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — TerraPulse" }] }),
  component: SignupPage,
});

const schema = z.object({
  display_name: z.string().trim().min(1, "Name required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [form, setForm] = useState({ display_name: "", email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: { display_name: parsed.data.display_name },
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message?.toLowerCase().includes("registered")
        ? "This email is already registered. Try signing in instead."
        : error.message;
      toast.error(msg);
      return;
    }
    if (!data.session) {
      toast.success("Check your email to confirm your account.");
      return;
    }
    toast.success("Account created. Welcome to TerraPulse!");
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
      title="Create your account"
      subtitle="Start tracking and reducing your footprint in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <Button onClick={onGoogle} disabled={oauthLoading} variant="outline" className="w-full">
        {oauthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
      </Button>
      <div className="relative my-6 text-center text-xs text-muted-foreground">
        <span className="bg-card px-3 relative z-10">or</span>
        <div className="absolute left-0 right-0 top-1/2 -z-0 border-t border-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="display_name">Name</Label>
          <Input id="display_name" required value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" />
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
