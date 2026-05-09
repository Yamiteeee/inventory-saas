"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import { salesService } from "@/services/salesService";
import { useCurrency } from "@/context/CurrencyContext";
import StatCard from "@/components/dashboard/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Calendar, ArrowRight, DollarSign, 
  Loader2, BarChart3, ChevronDown, Package as PackageIcon
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

type ViewMode = "Yearly" | "Monthly" | "Weekly" | "Daily";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockItems: 0 });
  const [allSales, setAllSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("Daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [statData, salesData] = await Promise.all([
            productService.getDashboardSummary(),
            salesService.getSalesHistory()
          ]);
          setStats(statData);
          setAllSales(salesData);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const chartData = useMemo(() => {
  const selected = new Date(selectedDate);
  const groups: Record<string, number> = {};

  // 1. Initialize keys for consistent X-Axis display
  if (viewMode === "Weekly") {
    ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].forEach(w => groups[w] = 0);
  }

  allSales.forEach(sale => {
    const saleDate = new Date(sale.created_at);
    const saleDateStr = saleDate.toISOString().split('T')[0];
    let key = "";

    // DAILY: Sun 06:00 AM
    if (viewMode === "Daily") {
      if (saleDateStr !== selectedDate) return;
      const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'short' });
      const hours = saleDate.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      key = `${dayName} ${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
    } 
    
    // WEEKLY: Exact Calendar Week (1st-7th = Week 1, etc.)
    else if (viewMode === "Weekly") {
      if (saleDate.getMonth() !== selected.getMonth() || saleDate.getFullYear() !== selected.getFullYear()) return;
      
      const dayOfMonth = saleDate.getDate();
      const weekNum = Math.ceil(dayOfMonth / 7);
      key = `Week ${weekNum}`;
    } 
    
    // MONTHLY: Full Month Name (January, February...)
    else if (viewMode === "Monthly") {
      if (saleDate.getFullYear() !== selected.getFullYear()) return;
      key = saleDate.toLocaleDateString('en-US', { month: 'long' });
    } 
    
    // YEARLY: The Year (2026)
    else if (viewMode === "Yearly") {
      if (saleDate.getFullYear() !== selected.getFullYear()) return;
      key = saleDate.getFullYear().toString();
    }

    if (key) {
      groups[key] = (groups[key] || 0) + (sale.total_price || 0);
    }
  });

  // 2. Format and Sort
  const result = Object.entries(groups)
    .map(([name, revenue]) => ({ name, revenue }))
    // Filter out 0 revenue weeks ONLY if there are other weeks with data
    .filter(item => viewMode !== "Weekly" || item.revenue >= 0); 

  return result.sort((a, b) => {
    if (viewMode === "Weekly") return a.name.localeCompare(b.name, undefined, { numeric: true });
    
    if (viewMode === "Monthly") {
      const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name);
    }
    
    return a.name.localeCompare(b.name);
  });
}, [allSales, viewMode, selectedDate]);

  const recentThreeSales = useMemo(() => allSales.slice(0, 3), [allSales]);

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      
      {/* --- HEADER --- */}
      <motion.header variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-zinc-500 font-medium">
            Status check for <span className="text-indigo-600">{user?.email?.split('@')[0]}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-zinc-600 shadow-sm border border-zinc-100">
          <Calendar size={16} className="text-indigo-500" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </motion.header>

      {/* --- STAT CARDS --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Products" value={stats.totalProducts} color="#6366f1" onClick={() => router.push('/dashboard/products')} />
        <StatCard title="Total Stock Units" value={stats.totalStock} color="#8b5cf6" onClick={() => router.push('/dashboard/products?mode=audit')} />
        <StatCard title="Low Stock Alerts" value={stats.lowStockItems} color="#ef4444" onClick={() => router.push('/dashboard/products?filter=low')} />
      </motion.div>

      {/* --- REVENUE BAR CHART --- */}
      <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900">Revenue Metrics</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {viewMode} Performance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl">
            {(["Daily", "Weekly", "Monthly", "Yearly"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  viewMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {mode}
              </button>
            ))}
            <div className="ml-2 border-l border-zinc-200 pl-2">
               <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-zinc-600 outline-none cursor-pointer"
               />
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
          {mounted ? (
            chartData.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                    dy={10} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800 }}
                    formatter={(value: any) => {
                        const numericValue = typeof value === 'number' ? value : 0;
                        return [formatPrice(numericValue), "Revenue"] as [string, string];
                    }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={viewMode === "Yearly" ? 60 : 30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-zinc-300">
                <BarChart3 size={40} className="mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest text-center">
                   No sales records for this {viewMode.toLowerCase()} period
                </p>
              </div>
            )
          ) : null}
        </div>
      </motion.div>

      {/* --- TOP 3 RECENT TRANSACTIONS --- */}
      <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Latest Transactions</h2>
          </div>
          <button onClick={() => router.push('/dashboard/sales')} className="group flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700">
            Full History <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {recentThreeSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <DollarSign size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm uppercase tracking-widest">No sales records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {recentThreeSales.map((sale, index) => (
              <motion.div 
                key={sale.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between py-5 hover:bg-zinc-50/50 rounded-2xl px-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 border border-zinc-100">
                    <PackageIcon size={20} />
                  </div>
                  <div>
                    <p className="font-black text-zinc-900 leading-none mb-1">{sale.products?.name || "Product"}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-green-600">+{formatPrice(sale.total_price)}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Captured</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}