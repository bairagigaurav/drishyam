"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail, Phone, Sparkles, User, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { submitOnboardingLead } from "@/lib/site-content";

const STORAGE_KEY = "drishyam_onboarding";

type Step = 0 | 1 | 2;

type FormData = {
  name: string;
  number: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const defaultForm: FormData = {
  name: "",
  number: "",
  email: "",
};

const validateField = (field: keyof FormData, value: string): string => {
  const trimmed = value.trim();

  if (field === "name") {
    if (!trimmed) return "Name is required.";
    if (trimmed.length < 2) return "Name must be at least 2 characters.";
    return "";
  }

  if (field === "number") {
    if (!trimmed) return "Phone number is required.";
    if (!/^\+?[0-9\s-]{7,15}$/.test(trimmed)) return "Enter a valid phone number.";
    return "";
  }

  if (field === "email") {
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
    return "";
  }

  return "";
};

export default function OnboardingModal() {
  const { isOnboardingOpen, setOnboardingOpen } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOnboardingOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOnboardingOpen]);

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const fieldError = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));
  };

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setOnboardingOpen(false);
  };

  const nextStep = () => {
    const currentError = validateField(step === 0 ? "name" : step === 1 ? "number" : "email", form[step === 0 ? "name" : step === 1 ? "number" : "email"]);

    if (currentError) {
      setErrors((prev) => ({
        ...prev,
        [step === 0 ? "name" : step === 1 ? "number" : "email"]: currentError,
      }));
      return;
    }

    if (step < 2) {
      setStep((prev) => (prev + 1) as Step);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    submitOnboardingLead(form);
    setOnboardingOpen(false);
  };

  const prevStep = () => {
    if (step > 0) setStep((prev) => (prev - 1) as Step);
  };

  const isComplete = form.name.trim() && form.number.trim() && form.email.trim();

  return (
    <AnimatePresence>
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-[#f2e8d5] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]"
          >
            <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_rgba(255,255,255,0))]" />

            <div className="relative p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#f3d699] bg-[#fff7eb] px-3 py-1 text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Welcome
                  </div>
                  <h2 className="font-serif text-3xl text-[#111111]">
                    {step === 0 && "Tell us who you are"}
                    {step === 1 && "Add your number"}
                    {step === 2 && "Almost there"}
                  </h2>
                </div>

                <button
                  onClick={handleClose}
                  className="rounded-full border border-[#e8ddcc] bg-white p-2 text-[#111111]/70 transition-colors hover:bg-[#f8f1e8]"
                  aria-label="Close onboarding"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-[#f1e4d1]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f97316] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="min-h-[220px]">
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="rounded-[26px] border border-[#f1e4d1] bg-[#fffaf5] p-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-lg shadow-[#111111]/10">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-[#111111]/65">
                        We’ll personalize your shopping experience and save your details for faster enquiries.
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase -[0.22em] text-[#111111]/50">
                        Full name
                      </span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your name"
                        className={`w-full rounded-2xl border bg-[#fffefb] px-4 py-3 text-base text-[#111111] placeholder:text-[#111111]/30 focus:outline-none ${errors.name ? "border-red-300 focus:border-red-400" : "border-[#e9dcc3] focus:border-[#f59e0b]"}`}
                      />
                      {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div className="rounded-[26px] border border-[#f1e4d1] bg-[#fffaf5] p-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20">
                        <Phone className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-[#111111]/65">
                        Add your number so our team can confirm your frame fit and order updates quickly.
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase -[0.22em] text-[#111111]/50">
                        Phone number
                      </span>
                      <input
                        type="tel"
                        value={form.number}
                        onChange={(e) => updateField("number", e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full rounded-2xl border bg-[#fffefb] px-4 py-3 text-base text-[#111111] placeholder:text-[#111111]/30 focus:outline-none ${errors.number ? "border-red-300 focus:border-red-400" : "border-[#e9dcc3] focus:border-[#f59e0b]"}`}
                      />
                      {errors.number && <p className="mt-2 text-xs text-red-600">{errors.number}</p>}
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="rounded-[26px] border border-[#f1e4d1] bg-[#fffaf5] p-4">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-lg shadow-[#111111]/10">
                        <Mail className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-[#111111]/65">
                        One last step — we’ll use your email for order updates, offers, and styling recommendations.
                      </p>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase -[0.22em] text-[#111111]/50">
                        Email address
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full rounded-2xl border bg-[#fffefb] px-4 py-3 text-base text-[#111111] placeholder:text-[#111111]/30 focus:outline-none ${errors.email ? "border-red-300 focus:border-red-400" : "border-[#e9dcc3] focus:border-[#f59e0b]"}`}
                      />
                      {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="rounded-full border border-[#e7dcc5] bg-white px-4 py-2 text-sm font-semibold uppercase -[0.16em] text-[#111111]/70 transition-colors hover:bg-[#f8f1e8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 0 && !form.name.trim()) ||
                    (step === 1 && !form.number.trim()) ||
                    (step === 2 && !form.email.trim())
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-5 py-3 text-sm font-bold uppercase -[0.18em] text-white shadow-[0_18px_34px_rgba(249,115,22,0.34)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === 2 ? "Finish" : "Next"}
                  {step !== 2 && <ArrowRight className="h-4 w-4" />}
                  {step === 2 && <Check className="h-4 w-4" />}
                </button>
              </div>

              {isComplete && step === 2 && (
                <p className="mt-4 text-center text-xs font-medium uppercase -[0.2em] text-[#0f766e]">
                  Profile ready
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
