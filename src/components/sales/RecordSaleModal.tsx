"use client";

import { useState, useEffect } from "react";
import { productService, Product } from "@/services/productService";
import { salesService } from "@/services/salesService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordSaleModal({ isOpen, onClose, onSuccess }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  // Change initial state to string to handle empty input safely
  const [quantity, setQuantity] = useState<number | string>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      productService.getProducts().then(setProducts);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  // Convert quantity to number safely for calculation
  const safeQuantity = Number(quantity) || 0;
  const totalPrice = selectedProduct ? selectedProduct.price * safeQuantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Please select a product");
    if (safeQuantity <= 0) return alert("Please enter a valid quantity");
    
    setLoading(true);
    try {
      await salesService.recordSale({
        product_id: selectedProductId,
        quantity: safeQuantity,
        total_price: totalPrice,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: 20, color: "#1e293b" }}>Record New Sale</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Select Product</label>
          <select 
            required
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={inputStyle}
          >
            <option value="">-- Choose a product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.price.toFixed(2)}) - {p.stock} in stock
              </option>
            ))}
          </select>

          <label style={labelStyle}>Quantity Sold</label>
          <input 
            type="number" 
            min="1"
            max={selectedProduct?.stock || 1}
            // Ensure we never pass NaN to the value attribute
            value={quantity} 
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty string so user can delete the number to type a new one
              setQuantity(val === "" ? "" : parseInt(val));
            }}
            style={inputStyle}
          />

          <div style={summaryBox}>
            <p style={{ margin: 0, color: "#64748b" }}>Total Revenue</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          <div style={buttonGroup}>
            <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
            <button 
                type="submit" 
                disabled={loading || !selectedProduct || safeQuantity <= 0} 
                style={submitBtn}
            >
              {loading ? "Processing..." : "Confirm Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ... styles remain the same ...
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" };
const modalStyle = { backgroundColor: "white", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "450px", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" };
const formStyle = { display: "flex", flexDirection: "column" as const, gap: "16px" };
const labelStyle = { fontSize: "0.875rem", fontWeight: "600", color: "#475569" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1rem", color: "#1e293b" };
const summaryBox = { marginTop: "10px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" as const };
const buttonGroup = { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" };
const submitBtn = { padding: "12px 24px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const cancelBtn = { padding: "12px 24px", backgroundColor: "transparent", color: "#64748b", border: "none", fontWeight: "600", cursor: "pointer" };