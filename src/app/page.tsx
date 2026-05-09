"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Visual Ambient Background - Adjusted for mobile aspect ratios */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] h-[60%] w-[80%] rounded-full bg-indigo-500/10 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] h-[50%] w-[80%] rounded-full bg-blue-600/10 blur-[80px] sm:blur-[120px]" />
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 py-12 sm:py-20 text-center"
      >
        {/* Logo / Brand Area */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="mb-8 sm:mb-12 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-md cursor-default"
        >
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20" />
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white">StockLogic</span>
        </motion.div>

        {/* Hero Section - Responsive Font Sizes */}
        <h1 className="max-w-3xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-7xl leading-[1.1]">
          Inventory management for the modern warehouse.
        </h1>
        
        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-zinc-400 px-2">
          Track products, manage stock levels, and audit your inventory with a 
          high-performance dashboard built for speed and precision.
        </p>

        {/* Action Buttons - Full width on mobile */}
        <div className="mt-10 sm:mt-12 flex flex-col w-full sm:w-auto gap-4 sm:flex-row px-4 sm:px-0">
          <Link
            href="/auth/login"
            className="flex h-14 w-full sm:w-auto items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/docs"
            className="flex h-14 w-full sm:w-auto items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Documentation
          </Link>
        </div>

        {/* Feature Grid - Better spacing for vertical stacking */}
        <div className="mt-20 sm:mt-24 grid w-full grid-cols-1 gap-4 sm:gap-6 text-left sm:grid-cols-3">
          {[
            { title: "Real-time Tracking", desc: "Instantly see stock changes across your entire catalog." },
            { title: "Audit Mode", desc: "Specialized interface for quick physical inventory verification." },
            { title: "Smart Alerts", desc: "Visual indicators for low stock and out-of-stock items." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-colors"
            >
              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Footer - Pushed to bottom properly */}
      <footer className="relative z-10 mt-auto w-full py-8 text-center text-zinc-600 px-6">
        <p className="text-xs sm:text-sm">© 2026 StockLogic. Built in San Pablo City, Laguna.</p>
      </footer>
    </div>
  );
}