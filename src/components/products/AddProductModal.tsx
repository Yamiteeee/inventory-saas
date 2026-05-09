"use client";

import { useState } from "react";
import { productService } from "@/services/productService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
    low_stock_threshold: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.addProduct(formData);
      onSuccess(); // Refresh the list
      onClose();   // Close the modal
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 20 }}>Add New Product</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label>Product Name</label>
          <input 
            type="text" 
            required 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Price</label>
              <input 
                type="number" 
                step="0.01" 
                required 
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Stock</label>
              <input 
                type="number" 
                required 
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} 
                style={inputStyle}
              />
            </div>
          </div>

          <label>Low Stock Alert Threshold</label>
          <input 
            type="number" 
            value={formData.low_stock_threshold}
            onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) })} 
            style={inputStyle}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={submitButtonStyle}>Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { backgroundColor: "white", padding: 30, borderRadius: 12, width: "100%", maxWidth: "500px", color: "#1e293b" };
const formStyle = { display: "flex", flexDirection: "column" as const, gap: "10px" };
const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "10px" };
const submitButtonStyle = { padding: "12px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const cancelButtonStyle = { padding: "12px", backgroundColor: "transparent", color: "#64748b", border: "none", cursor: "pointer" };