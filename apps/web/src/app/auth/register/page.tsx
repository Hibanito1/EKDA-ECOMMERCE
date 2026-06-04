"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@ekda/shared";
import { USER_ROLE_INFO } from "@ekda/shared";
import { validateRegister, validateKYCBusiness, hasErrors } from "@/lib/validation";

const STEPS = ["Choose Role", "Account Details", "Business Info"];

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || null;

  const [step, setStep] = useState(initialRole ? 1 : 0);
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    country: "NG",
    business_name: "",
    business_country: "NG",
    vendor_type: "nigerian_export",
    carrier_type: "local_logistics",
    company_name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requiresBusiness = role === "vendor" || role === "enterprise" || role === "carrier";
  const totalSteps = requiresBusiness ? 3 : 2;

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  /** Uses @ekda/validators → validateRegister via @/lib/validation */
  const validateStep1 = () => {
    const errs = validateRegister({
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: role ?? "",
    });
    setErrors(errs);
    return !hasErrors(errs);
  };

  /** Uses @ekda/validators → validateKYCBusiness via @/lib/validation */
  const validateStep2 = () => {
    if (role === "vendor" || role === "enterprise") {
      const errs = validateKYCBusiness({ business_name: form.business_name });
      setErrors(errs);
      return !hasErrors(errs);
    }
    if (role === "carrier") {
      const errs: Record<string, string> = {};
      if (!form.company_name.trim()) errs.company_name = "Company name is required";
      setErrors(errs);
      return !hasErrors(errs);
    }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !role) {
      toast.error("Please select a role");
      return;
    }
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && requiresBusiness && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleRegister = async () => {
    if (step === 1 && !validateStep1()) return;
    if (requiresBusiness && step === 2 && !validateStep2()) return;
    
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const profileData: Record<string, unknown> = {
          id: authData.user.id,
          email: form.email,
          full_name: form.full_name,
          phone: form.phone || null,
          role: role!,
          country: form.country,
          business_name: form.business_name || null,
          business_country: form.business_country || null,
          vendor_type: role === "vendor" ? form.vendor_type : null,
          carrier_type: role === "carrier" ? form.carrier_type : null,
          company_name: form.company_name || null,
        };
        const { error: profileError } = await supabase.from("profiles").upsert(profileData as any);

        if (profileError) console.error("Profile error:", profileError);
      }

      toast.success("Account created! Please check your email to verify.");
      router.push(`/auth/onboarding?role=${role}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!role) {
      toast.error("Please select a role first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google signup failed";
      toast.error(message);
      setLoading(false);
    }
  };

  const roles: UserRole[] = ["customer", "vendor", "enterprise", "carrier"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-6 lg:hidden">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <span className="font-bold text-xl">EKDA</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.slice(0, requiresBusiness ? 3 : 2).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  step > i
                    ? "bg-primary text-white"
                    : step === i
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < (requiresBusiness ? 2 : 1) && (
                <div className={`flex-1 h-0.5 ${step > i ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold">
          {step === 0 ? "Choose your role" : step === 1 ? "Create your account" : "Business details"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {step === 0
            ? "Select how you'll use EKDA"
            : step === 1
            ? "Enter your account information"
            : "Tell us about your business"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Role Selection */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {roles.map((r) => {
              const info = USER_ROLE_INFO[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    role === r
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <span className="text-3xl">{info.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{info.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {info.description}
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      role === r
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {role === r && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
            <Button
              size="lg"
              variant="premium"
              className="w-full mt-6"
              onClick={() => setStep(1)}
              disabled={!role}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Account Details */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {role && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl mb-4">
                <span className="text-xl">{USER_ROLE_INFO[role].icon}</span>
                <span className="text-sm font-medium">{USER_ROLE_INFO[role].label}</span>
                <button
                  onClick={() => setStep(0)}
                  className="ml-auto text-xs text-primary hover:underline"
                >
                  Change
                </button>
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Input
              label="Full Name"
              placeholder="Adaeze Okonkwo"
              value={form.full_name}
              onChange={(e) => updateForm("full_name", e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              error={errors.full_name}
              required
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email}
              required
            />
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+234 801 234 5678"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              leftIcon={<Phone className="h-4 w-4" />}
              hint="Optional — for SMS alerts"
            />
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => updateForm("password", e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="lg" onClick={() => setStep(0)} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="premium"
                className="flex-1"
                onClick={requiresBusiness ? handleNext : handleRegister}
                loading={!requiresBusiness && loading}
              >
                {requiresBusiness ? "Next" : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Business Details */}
        {step === 2 && requiresBusiness && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {(role === "vendor" || role === "enterprise") && (
              <>
                <Input
                  label="Business Name"
                  placeholder="Your business name"
                  value={form.business_name}
                  onChange={(e) => updateForm("business_name", e.target.value)}
                  error={errors.business_name}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Vendor Type <span className="text-destructive">*</span></label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "nigerian_export", label: "🌿 Nigerian Exporter", desc: "Sell African goods globally" },
                      { value: "international_import", label: "🌍 International Importer", desc: "Sell goods to Nigeria/Africa" },
                      { value: "both", label: "🔄 Both", desc: "Export & Import" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateForm("vendor_type", opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          form.vendor_type === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {role === "carrier" && (
              <>
                <Input
                  label="Company Name"
                  placeholder="Your logistics company"
                  value={form.company_name}
                  onChange={(e) => updateForm("company_name", e.target.value)}
                  error={errors.company_name}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Carrier Type <span className="text-destructive">*</span></label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "local_logistics", label: "🚛 Local / Road", desc: "Nigeria & intra-Africa routes" },
                      { value: "international_freight", label: "🚢 International", desc: "Global air & sea freight" },
                      { value: "both", label: "🔄 Both", desc: "Local & international" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateForm("carrier_type", opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          form.carrier_type === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="premium"
                className="flex-1"
                onClick={handleRegister}
                loading={loading}
              >
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
