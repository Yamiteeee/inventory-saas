"use client";

import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import RecordSaleModal from "@/components/sales/RecordSaleModal";

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSales = async () => {
    try {
      const data = await salesService.getSalesHistory();
      setSales(data);
    } catch (err: any) {
      console.error("Error loading sales:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  if (loading) return <p style={{ padding: "20px", color: "#64748b" }}>Loading sales history...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e293b", margin: 0 }}>Sales History</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          style={recordSaleBtn}
        >
          + New Sale
        </button>
      </div>

      <div style={tableContainer}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#94a3b8" }}>
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} style={trStyle}>
                  <td style={tdStyle}>{new Date(sale.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}>{sale.products?.name || "Deleted Product"}</td>
                  <td style={tdStyle}>{sale.quantity}</td>
                  <td style={tdStyle}>${sale.total_price.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for recording new sales */}
      <RecordSaleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadSales} 
      />
    </div>
  );
}

// Minimalist Pro Styles
const tableContainer = { backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const };
const thStyle = { textAlign: "left" as const, padding: "16px", backgroundColor: "#f8fafc", color: "#64748b", fontSize: "0.875rem" };
const tdStyle = { padding: "16px", borderTop: "1px solid #e2e8f0", color: "#1e293b" };
const trStyle = { transition: "0.2s" };
const recordSaleBtn = { padding: "10px 20px", backgroundColor: "#1e293b", color: "white", borderRadius: "8px", border: "none", cursor: "pointer" };