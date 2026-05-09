"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productService, Product } from "@/services/productService";
import AddProductModal from "@/components/products/AddProductModal";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  
  // New State for Audit Mode
  const [isAuditMode, setIsAuditMode] = useState(searchParams.get("mode") === "audit");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(searchParams.get("filter") || "all"); 
  const [sortBy, setSortBy] = useState("name");

  const fetchProducts = async () => {
    const data = await productService.getProducts();
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Sync if URL changes (useful if user clicks different dashboard cards)
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
      // In Audit Mode, we usually want to see high-stock items first to verify bulk
      if (isAuditMode || sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

    setFilteredProducts(result);
  }, [products, searchTerm, filterStatus, sortBy, isAuditMode]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: "#1e293b", fontSize: "1.875rem", fontWeight: "700" }}>
            {isAuditMode ? "📦 Inventory Audit" : "Inventory Management"}
          </h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
            {isAuditMode 
              ? "Fast-update stock levels to match physical counts." 
              : "Manage and track your product stock levels."}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setIsAuditMode(!isAuditMode)} 
            style={{...addBtnStyle, backgroundColor: isAuditMode ? "#64748b" : "#4f46e5"}}
          >
            {isAuditMode ? "Exit Audit" : "Start Audit"}
          </button>
          {!isAuditMode && (
            <button onClick={() => setModalOpen(true)} style={addBtnStyle}>+ Add Product</button>
          )}
        </div>
      </header>

      <div style={filterBar}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
        
        {!isAuditMode && (
          <>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
              <option value="all">All Inventory</option>
              <option value="low">Low Stock Alerts</option>
              <option value="out">Out of Stock</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="name">Sort by Name</option>
              <option value="price">Price: Low to High</option>
              <option value="stock">Stock: High to Low</option>
            </select>
          </>
        )}
      </div>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Product Name</th>
              {!isAuditMode && <th style={thStyle}>Price</th>}
              <th style={thStyle}>{isAuditMode ? "Physical Count" : "Stock Level"}</th>
              {!isAuditMode && <th style={thStyle}>Status</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} style={trStyle}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: "600", color: "#1e293b" }}>{p.name}</div>
                </td>
                
                {!isAuditMode && <td style={tdStyle}>${p.price.toFixed(2)}</td>}
                
                <td style={tdStyle}>
                  {isAuditMode ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input 
                        type="number" 
                        defaultValue={p.stock} 
                        style={auditInputStyle} 
                      />
                      <button style={updateBtnStyle}>Save</button>
                    </div>
                  ) : (
                    <span style={{ color: p.stock <= 10 ? "#dc2626" : "inherit", fontWeight: p.stock <= 10 ? "600" : "400" }}>
                      {p.stock} units
                    </span>
                  )}
                </td>

                {!isAuditMode && (
                  <td style={tdStyle}>
                    <span style={getStatusStyle(p.stock)}>
                      {p.stock === 0 ? "Out of Stock" : p.stock <= 10 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchProducts} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p style={{ padding: "40px" }}>Loading inventory...</p>}>
      <ProductsContent />
    </Suspense>
  );
}

// --- Styles ---
const containerStyle = { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" };
const addBtnStyle = { padding: "12px 24px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const filterBar = { display: "flex", gap: "16px", marginBottom: "24px" };
const searchStyle = { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem" };
const selectStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "white", cursor: "pointer" };
const tableContainer = { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const };
const theadStyle = { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" };
const thStyle = { textAlign: "left" as const, padding: "16px", fontSize: "0.875rem", fontWeight: "600", color: "#475569" };
const trStyle = { borderBottom: "1px solid #f1f5f9" };
const tdStyle = { padding: "16px", color: "#475569" };

// Audit Specific Styles
const auditInputStyle = { width: "80px", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" };
const updateBtnStyle = { padding: "8px 12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" };

const getStatusStyle = (stock: number) => ({
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "0.75rem",
  fontWeight: "700",
  backgroundColor: stock === 0 ? "#fee2e2" : stock <= 10 ? "#fef3c7" : "#dcfce7",
  color: stock === 0 ? "#991b1b" : stock <= 10 ? "#92400e" : "#166534"
});