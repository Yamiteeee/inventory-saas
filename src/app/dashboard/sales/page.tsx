"use client";

import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import RecordSaleModal from "@/components/sales/RecordSaleModal";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, revenue

  const loadSales = async () => {
    try {
      const data = await salesService.getSalesHistory();
      setSales(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSales(); }, []);

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...sales];

    // 1. Search by Product Name (reaching into the 'products' relation)
    if (searchTerm) {
      result = result.filter(sale => 
        sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sorting
    result.sort((a, b) => {
      if (sortBy === "revenue") return b.total_price - a.total_price;
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // default newest
    });

    setFilteredSales(result);
  }, [sales, searchTerm, sortBy]);

  if (loading) return <p style={{ padding: "40px", color: "#64748b" }}>Loading sales history...</p>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Sales Transactions</h1>
          <p style={subtitleStyle}>Track your revenue and recent inventory outflows.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={recordBtnStyle}>
          + Record Sale
        </button>
      </header>

      {/* Filter Bar */}
      <div style={filterBar}>
        <input 
          type="text" 
          placeholder="Search by product name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="revenue">Highest Revenue</option>
        </select>
      </div>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Transaction Date</th>
              <th style={thStyle}>Product Item</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#94a3b8", padding: "40px" }}>
                  No transactions found matching your search.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} style={trStyle}>
                  <td style={tdStyle}>
                    {new Date(sale.created_at).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    })}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: "600" }}>
                    {sale.products?.name || "Unknown Product"}
                  </td>
                  <td style={tdStyle}>{sale.quantity}</td>
                  <td style={{ ...tdStyle, color: "#16a34a", fontWeight: "700" }}>
                    +${sale.total_price.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <RecordSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadSales} 
      />
    </div>
  );
}

// Reuse the high-end styles from the Products page
const containerStyle = { padding: "40px" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" };
const titleStyle = { margin: 0, color: "#1e293b", fontSize: "1.875rem", fontWeight: "700" };
const subtitleStyle = { color: "#64748b", margin: "4px 0 0 0" };
const recordBtnStyle = { padding: "12px 24px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const filterBar = { display: "flex", gap: "16px", marginBottom: "24px" };
const searchStyle = { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem" };
const selectStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "white", cursor: "pointer" };
const tableContainer = { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const };
const thStyle = { textAlign: "left" as const, padding: "16px", fontSize: "0.875rem", fontWeight: "600", color: "#475569", backgroundColor: "#f8fafc" };
const tdStyle = { padding: "16px", color: "#1e293b", borderTop: "1px solid #f1f5f9" };
const trStyle = { transition: "0.2s" };