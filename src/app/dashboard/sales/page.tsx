"use client";

import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import RecordSaleModal from "@/components/sales/RecordSaleModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Package,
  Loader2,
  History
} from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const loadSales = async () => {
    try {
      const data = await salesService.getSalesHistory();
      setSales(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSales(); }, []);

  useEffect(() => {
    let result = [...sales];
    if (searchTerm) {
      result = result.filter(sale => 
        sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
      if (sortBy === "revenue") return b.total_price - a.total_price;
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setFilteredSales(result);
  }, [sales, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* --- HEADER --- */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <History size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Financial Logs</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Sales Transactions</h1>
          <p className="text-zinc-500">Track revenue and inventory outflows in real-time.</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-zinc-900/20 transition-all hover:bg-zinc-800"
        >
          <Plus size={18} />
          Record New Sale
        </motion.button>
      </header>

      {/* --- FILTER BAR --- */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white py-4 pl-11 pr-10 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="revenue">Highest Revenue</option>
          </select>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-5 font-bold text-zinc-500">
                  <div className="flex items-center gap-2"><CalendarIcon size={14} /> Date</div>
                </th>
                <th className="px-6 py-5 font-bold text-zinc-500">
                  <div className="flex items-center gap-2"><Package size={14} /> Product Item</div>
                </th>
                <th className="px-6 py-5 font-bold text-zinc-500 text-center">Qty</th>
                <th className="px-6 py-5 font-bold text-zinc-500 text-right">
                   <div className="flex items-center justify-end gap-2"><DollarSign size={14} /> Revenue</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              <AnimatePresence mode="popLayout">
                {filteredSales.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="py-20 text-center text-zinc-400">
                      <div className="flex flex-col items-center gap-2">
                        <History size={40} className="opacity-10" />
                        <p className="font-medium">No transactions found.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredSales.map((sale) => (
                    <motion.tr 
                      layout
                      key={sale.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group transition-colors hover:bg-zinc-50/50"
                    >
                      <td className="px-6 py-5">
                        <span className="font-medium text-zinc-600">
                          {new Date(sale.created_at).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <Package size={16} />
                          </div>
                          <span className="font-bold text-zinc-900">{sale.products?.name || "Unknown Product"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                          {sale.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-base font-black text-green-600">
                            +${sale.total_price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Captured</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <RecordSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadSales} 
      />
    </motion.div>
  );
}