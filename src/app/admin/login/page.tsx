"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const ADMIN_USER = "admin";
const ADMIN_PASS = "drishyam123";
const AUTH_KEY = "drishyam_admin_auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      router.replace("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      router.replace("/admin");
    } else {
      setError("Incorrect username or password. Please try again.");
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full rounded-2xl border border-[#eadcc6] bg-[#fffdf9] px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-[#aaa] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20";

  return (
    <main className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4">
      {/* Background decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#f59e0b]/8 blur-[80px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#111111]/5 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-[32px] border border-[#eadcc6] bg-white p-8 shadow-[0_40px_90px_rgba(17,17,17,0.10)]">
          {/* Brand */}
          <div className="mb-8 text-center flex flex-col items-center">
            <BrandLogo variant="full" size="lg" theme="dark" href="/" className="mb-4" />
            <h1 className="font-serif text-2xl text-[#111111] font-semibold">
              Admin Portal
            </h1>
            <p className="mt-1 text-sm text-[#111111]/50">
              Sign in to manage store content, cards, and catalogue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">
                Username
              </span>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa]" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username"
                  className={`${fieldClass} pl-11`}
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">
                Password
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa]" />
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className={`${fieldClass} pl-11 pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#111111] transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-[#111111] px-5 py-4 text-sm font-bold uppercase -[0.2em] text-white transition-all hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p className="mt-6 text-center text-[11px] text-[#111111]/35">
            Authorized personnel only — Drishyam Optical
          </p>
        </div>
      </div>
    </main>
  );
}
