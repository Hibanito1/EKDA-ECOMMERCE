"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { DEMO_USERS } from "@/lib/demo";
import { validateLogin } from "@/lib/validation";
import { useDemoAuth } from "@/lib/auth/DemoAuthContext";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function LoginPage() {
  const router = useRouter();
  const { login: demoLogin } = useDemoAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs = validateLogin({ email: form.email, password: form.password });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Demo mode: use context login() — persists to localStorage automatically
      if (DEMO_MODE && form.email.endsWith("@ekda.io")) {
        const result = await demoLogin(form.email, form.password);
        if (!result.success) throw new Error(result.error);
        toast.success(
          `🎭 Demo Mode — Welcome! Redirecting to ${
            result.redirectTo?.split("/").pop() ?? "dashboard"
          } dashboard.`
        );
        router.push(result.redirectTo ?? "/dashboard");
        return;
      }
      // Production: Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="font-bold text-xl">EKDA</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to continue to EKDA Marketplace
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full mb-6"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email}
          required
        />
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-end">
          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" variant="premium" className="w-full" loading={loading}>
          Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Create account
        </Link>
      </p>

      {/* Demo quick-login panel */}
      {DEMO_MODE && (
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              Quick Demo Login
            </span>
            <span className="text-[10px] text-indigo-500 ml-auto">
              Session persists on refresh
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(DEMO_USERS).map(([role, user]) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ email: user.email, password: user.password })}
                className="text-[10px] bg-white dark:bg-ekda-dark px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium capitalize"
              >
                {role === "admin" ? "⚡" : role === "vendor" ? "🏪" : role === "carrier" ? "🚢" : role === "enterprise" ? "🏢" : "🛍️"}{" "}
                {role}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Password: Demo@12345 · Session stored in localStorage for persistence
          </p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="hover:underline">Terms of Service</Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
      </p>
    </motion.div>
  );
}
