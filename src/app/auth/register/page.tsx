// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.register(email, password);
      setIsSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 sm:px-6 selection:bg-indigo-500/30 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-600/10 blur-[80px] sm:blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <motion.div 
              initial={{ rotate: 10 }}
              animate={{ rotate: 0 }}
              className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20" 
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Create Account</h1>
            <p className="mt-2 text-sm text-zinc-400">Join StockLogic to start managing your inventory</p>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 py-4 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Registration Successful!</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Redirecting you to login...
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleRegister} 
                className="space-y-4 sm:space-y-5"
                exit={{ opacity: 0, scale: 0.95 }}
              >
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
                    placeholder="jason@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-600 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 block text-xs sm:text-sm font-medium text-zinc-300">Password</label>
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder:text-zinc-600 text-sm sm:text-base"
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
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 text-center text-xs sm:text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-white hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}