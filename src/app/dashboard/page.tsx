"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import { salesService } from "@/services/salesService";
import StatCard from "@/components/dashboard/StatCard";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, ArrowRight, DollarSign, Loader2 } from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockItems: 0 });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [statData, salesData] = await Promise.all([
            productService.getDashboardSummary(),
            salesService.getSalesHistory()
          ]);
          setStats(statData);
          setRecentSales(salesData.slice(0, 5));
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* --- HEADER --- */}
      <motion.header variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard Overview</h1>
          <p className="mt-1 text-zinc-500">Welcome back, <span className="font-medium text-zinc-700">{user?.email}</span></p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-500 shadow-sm border border-zinc-100">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </motion.header>

      {/* --- STAT CARDS --- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          color="#6366f1" 
          onClick={() => router.push('/dashboard/products')}
        />
        <StatCard 
          title="Total Stock Units" 
          value={stats.totalStock} 
          color="#8b5cf6" 
          onClick={() => router.push('/dashboard/products?mode=audit')}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockItems} 
          color="#ef4444" 
          onClick={() => router.push('/dashboard/products?filter=low')}
        />
      </motion.div>

      {/* --- RECENT ACTIVITY --- */}
      <motion.div variants={itemVariants} className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Recent Sales</h2>
          </div>
          <button 
            onClick={() => router.push('/dashboard/sales')}
            className="group flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {recentSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <DollarSign size={48} className="mb-4 opacity-20" />
            <p>No recent sales recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {recentSales.map((sale, index) => (
              <motion.div 
                key={sale.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between py-5 transition-colors hover:bg-zinc-50/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{sale.products?.name || "Inventory Item"}</p>
                    <p className="text-xs font-medium text-zinc-400">
                      {new Date(sale.created_at).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">+${sale.total_price.toFixed(2)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Paid</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}