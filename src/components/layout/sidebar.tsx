"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  BadgeDollarSign, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const constraintsRef = useRef(null);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Sales", href: "/dashboard/sales", icon: BadgeDollarSign },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 
         Constraints Container: This invisible layer allows the button 
         to be dragged anywhere on the screen without flying off.
      */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50 lg:hidden" />

      {/* --- MOVABLE MOBILE BURGER BUTTON --- */}
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onClick={toggleSidebar}
        // While drag is active, we prevent clicking from firing immediately
        onDragStart={() => (document.body.style.overflow = "hidden")}
        onDragEnd={() => (document.body.style.overflow = "auto")}
        className="fixed top-4 left-4 z-50 flex h-12 w-12 cursor-grab items-center justify-center rounded-2xl border border-white/10 bg-[#1a1a1a] text-white shadow-2xl active:cursor-grabbing lg:hidden pointer-events-auto"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] flex-col border-r border-white/5 bg-[#0a0a0a] text-white transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:flex ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Area */}
        <div className="flex items-center gap-3 px-8 py-10">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/40" />
          <span className="text-xl font-bold tracking-tight">StockLogic</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <Icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive(item.href) ? "text-indigo-400" : "group-hover:text-zinc-200"
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Section */}
        <div className="border-t border-white/5 p-6">
          <button
            onClick={() => authService.logout()}
            className="group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}