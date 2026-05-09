// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 sm:px-6 selection:bg-indigo-500/30 overflow-hidden">
      {/* Background Ambient Glow - Fixed with inline RGBA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[50%] left-[50%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] sm:blur-[120px]" 
          style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2"
          >
            <svg 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to homepage
          </motion.span>
        </Link>

        {/* Card Container - Fixed with inline RGBA */}
        <div 
          className="rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <div className="mb-8 text-center">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20" 
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your inventory</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-red-500/10 p-3 text-xs sm:text-sm font-medium text-red-400 border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="ml-1 block text-xs sm:text-sm font-medium text-zinc-300">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-zinc-600 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 block text-xs sm:text-sm font-medium text-zinc-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-zinc-600 text-sm sm:text-base"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-white font-bold text-black transition-all hover:bg-zinc-200 disabled:opacity-70 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-xs sm:text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-white hover:underline underline-offset-4">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Localized Footer */}
        <p className="mt-8 text-center text-[10px] sm:text-xs text-zinc-600 tracking-widest uppercase">
          StockLogic Gateway • Tanauan City, PH
        </p>
      </motion.div>
    </div>
  );
}