"use client";

import { useState } from "react";
import { productService } from "@/services/productService";
import { Package, DollarSign, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  activeCurrencyCode: string; // Passed from global state
}

export default function AddProductModal({ isOpen, onClose, onSuccess, activeCurrencyCode }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: 0,
    cost_price: 0,
    stock: 0,
    low_stock_threshold: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.addProduct({
        ...formData,
        currency_code: activeCurrencyCode // Injects global currency on save
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={iconBoxStyle}><Package size={20} /></div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Name & SKU */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Product Name</label>
              <input 
                type="text" required placeholder="e.g. Mechanical Keyboard"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>SKU (Optional)</label>
              <input 
                type="text" placeholder="KB-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
                style={inputStyle}
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <DollarSign size={14} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Pricing ({activeCurrencyCode})
              </span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Selling Price</label>
                <input 
                  type="number" step="0.01" required 
                  value={formData.price || ""} 
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} 
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Cost Price</label>
                <input 
                  type="number" step="0.01" required 
                  value={formData.cost_price || ""} 
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })} 
                  style={inputStyle}
                />
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, margin: 0 }}>
              * Values will be recorded in your currently active currency.
            </p>
          </div>

          {/* Stock Row */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Current Stock</label>
              <input 
                type="number" required 
                value={formData.stock || ""} 
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} 
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Low Stock Alert</label>
              <div style={{ position: "relative" }}>
                <input 
                  type="number" 
                  value={formData.low_stock_threshold || ""}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 0 })} 
                  style={{ ...inputStyle, paddingLeft: 34 }}
                />
                <AlertTriangle size={14} style={{ position: "absolute", left: 12, top: 14, color: "#f59e0b" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={submitButtonStyle}>Save to Inventory</button>
          </div>
        </form>
      </div>
    </div>
  );
}
// ... (Your existing styles remain the same)
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { backgroundColor: "white", padding: 32, borderRadius: 24, width: "95%", maxWidth: "550px", color: "#0f172a", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" };
const iconBoxStyle = { backgroundColor: "#f1f5f9", padding: 10, borderRadius: 12, color: "#6366f1" };
const formStyle = { display: "flex", flexDirection: "column" as const, gap: "16px" };
const sectionStyle = { backgroundColor: "#f8fafc", padding: 16, borderRadius: 16, border: "1px solid #f1f5f9" };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 14, outline: "none", transition: "border-color 0.2s" };
const submitButtonStyle = { padding: "12px 24px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: 600, fontSize: 14 };
const cancelButtonStyle = { padding: "12px 24px", backgroundColor: "transparent", color: "#64748b", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 };