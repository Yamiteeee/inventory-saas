"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { productService, Product } from "@/services/productService";
import AddProductModal from "@/components/products/AddProductModal";
import { useCurrency } from "@/context/CurrencyContext"; // Global Currency Hook
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Box, Loader2, Save, Trash2, TrendingUp,
  PackageSearch
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(searchParams.get("mode") === "audit");
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("filter") || "all"); 
  const [sortBy, setSortBy] = useState("name");

  // Consume Global Currency Context
  const { currencyCode, formatPrice } = useCurrency();

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedIds.length} items?`)) return;
    try {
      await productService.deleteMultipleProducts(selectedIds);
      await fetchProducts();
      setSelectedIds([]);
    } catch (err: any) {
      alert("Error during bulk removal: " + err.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map(p => p.id!));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) result = result.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterStatus === "low") result = result.filter(p => p.stock > 0 && p.stock <= p.low_stock_threshold);
    else if (filterStatus === "out") result = result.filter(p => p.stock === 0);

    result.sort((a, b) => {
      if (isAuditMode || sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [products, searchTerm, filterStatus, sortBy, isAuditMode]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Box size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products & Stock</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAuditMode(!isAuditMode)} 
            className={`rounded-2xl px-5 py-3 text-sm font-bold transition-all ${isAuditMode ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"}`}
          >
            {isAuditMode ? "Exit Audit" : "Bulk Audit"}
          </button>

          {!isAuditMode && (
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setModalOpen(true)} 
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Product
            </motion.button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-white font-bold text-sm">
              <PackageSearch size={18} className="text-indigo-400" />
              {selectedIds.length} items selected
            </div>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={14} /> Remove Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" placeholder="Search by name or SKU..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
          />
        </div>
        {!isAuditMode && (
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold outline-none">
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded accent-indigo-600" 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-5 font-bold text-zinc-500 uppercase tracking-tighter text-[11px]">Product Details</th>
                <th className="px-6 py-5 font-bold text-zinc-500 uppercase tracking-tighter text-[11px]">Pricing & Margin</th>
                <th className="px-6 py-5 font-bold text-zinc-500 uppercase tracking-tighter text-[11px]">Stock Status</th>
                {!isAuditMode && <th className="px-6 py-5 font-bold text-zinc-500 uppercase tracking-tighter text-[11px]">Condition</th>}
                {!isAuditMode && <th className="px-6 py-5 font-bold text-zinc-500 uppercase tracking-tighter text-[11px] text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProducts.map((p) => {
                const margin = p.price > 0 ? Math.round(((p.price - p.cost_price) / p.price) * 100) : 0;
                return (
                  <tr key={p.id} className={`group transition-colors ${selectedIds.includes(p.id!) ? "bg-indigo-50/40" : "hover:bg-zinc-50/50"}`}>
                    <td className="px-6 py-5">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded accent-indigo-600"
                        checked={selectedIds.includes(p.id!)}
                        onChange={() => toggleSelect(p.id!)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-zinc-900 block leading-tight">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 block uppercase">{p.sku || `SKU-${p.id?.slice(0, 5)}`}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        {/* Dynamic Global Formatting */}
                        <span className="font-bold text-zinc-900">{formatPrice(p.price)}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-400">Cost: {formatPrice(p.cost_price)}</span>
                          <div className={`flex items-center gap-0.5 text-[10px] font-black ${margin > 20 ? 'text-green-600' : 'text-amber-600'}`}>
                            <TrendingUp size={10} /> {margin}%
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {isAuditMode ? (
                        <div className="flex items-center gap-2">
                          <input type="number" defaultValue={p.stock} className="w-20 rounded-xl border border-zinc-200 p-2 font-bold focus:border-indigo-500 outline-none" />
                          <button className="rounded-xl bg-zinc-900 p-2 text-white hover:bg-zinc-800"><Save size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-black ${p.stock <= p.low_stock_threshold ? "text-red-600" : "text-zinc-900"}`}>{p.stock}</span>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">Units</span>
                        </div>
                      )}
                    </td>
                    {!isAuditMode && (
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tight ${
                          p.stock === 0 ? "bg-red-50 text-red-600" : 
                          p.stock <= p.low_stock_threshold ? "bg-amber-50 text-amber-600" : 
                          "bg-green-50 text-green-600"
                        }`}>
                          {p.stock === 0 ? "Void" : p.stock <= p.low_stock_threshold ? "Critically Low" : "Optimal"}
                        </div>
                      </td>
                    )}
                    {!isAuditMode && (
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleDelete(p.id!, p.name)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProducts} 
        activeCurrencyCode={currencyCode} // Synchronized with Global Selection
      />
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}