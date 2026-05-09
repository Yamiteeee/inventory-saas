"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productService, Product } from "@/services/productService";
import AddProductModal from "@/components/products/AddProductModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Box, 
  ClipboardCheck, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown,
  Loader2,
  Save
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(searchParams.get("mode") === "audit");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("filter") || "all"); 
  const [sortBy, setSortBy] = useState("name");

  const fetchProducts = async () => {
    const data = await productService.getProducts();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (searchParams.get("mode") === "audit") setIsAuditMode(true);
    if (searchParams.get("filter")) setFilterStatus(searchParams.get("filter")!);
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterStatus === "low") {
      result = result.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (filterStatus === "out") {
      result = result.filter(p => p.stock === 0);
    }

    result.sort((a, b) => {
      if (isAuditMode || sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
    setFilteredProducts(result);
  }, [products, searchTerm, filterStatus, sortBy, isAuditMode]);

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
            {isAuditMode ? <ClipboardCheck size={18} /> : <Box size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider">
              {isAuditMode ? "Inventory Verification" : "Warehouse Stock"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {isAuditMode ? "Inventory Audit" : "Inventory Management"}
          </h1>
          <p className="text-zinc-500">
            {isAuditMode 
              ? "Verify and update physical counts quickly." 
              : "Monitor levels, pricing, and stock alerts."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAuditMode(!isAuditMode)} 
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${
              isAuditMode 
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" 
              : "bg-white border border-zinc-200 text-zinc-600 shadow-sm hover:border-zinc-300"
            }`}
          >
            {isAuditMode ? "Exit Audit" : "Start Audit"}
          </button>
          {!isAuditMode && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModalOpen(true)} 
              className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-zinc-900/20 hover:bg-zinc-800"
            >
              <Plus size={18} /> Add Product
            </motion.button>
          )}
        </div>
      </header>

      {/* --- FILTERS --- */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Find a product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
          />
        </div>
        
        <AnimatePresence>
          {!isAuditMode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-4"
            >
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-medium outline-none">
                <option value="all">All Inventory</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm font-medium outline-none">
                <option value="name">Sort by Name</option>
                <option value="price">Price: Low to High</option>
                <option value="stock">Stock: High to Low</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-50/50 border-bottom border-zinc-100">
                <th className="px-6 py-5 font-bold text-zinc-500">Product Details</th>
                {!isAuditMode && <th className="px-6 py-5 font-bold text-zinc-500">Unit Price</th>}
                <th className="px-6 py-5 font-bold text-zinc-500">
                  {isAuditMode ? "Physical Count Entry" : "Available Stock"}
                </th>
                {!isAuditMode && <th className="px-6 py-5 font-bold text-zinc-500">Inventory Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredProducts.map((p) => (
                <motion.tr layout key={p.id} className="group transition-colors hover:bg-zinc-50/50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Box size={20} />
                      </div>
                      <span className="font-bold text-zinc-900">{p.name}</span>
                    </div>
                  </td>
                  
                  {!isAuditMode && (
                    <td className="px-6 py-5 font-semibold text-zinc-600">
                      ${p.price.toFixed(2)}
                    </td>
                  )}
                  
                  <td className="px-6 py-5">
                    {isAuditMode ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={p.stock} 
                          className="w-24 rounded-xl border border-zinc-200 px-3 py-2 font-bold focus:border-green-500 outline-none"
                        />
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 hover:bg-green-700">
                          <Save size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${p.stock <= 10 ? "text-red-600" : "text-zinc-900"}`}>
                          {p.stock}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-tighter">Units</span>
                      </div>
                    )}
                  </td>

                  {!isAuditMode && (
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        p.stock === 0 ? "bg-red-50 text-red-700" : 
                        p.stock <= 10 ? "bg-amber-50 text-amber-700" : 
                        "bg-green-50 text-green-700"
                      }`}>
                        {p.stock === 0 ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                        {p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "In Stock"}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchProducts} />
    </motion.div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}