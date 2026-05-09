"use client";

import { useState, useEffect } from "react";
import { productService, Product } from "@/services/productService";
import { salesService } from "@/services/salesService";
import { useCurrency } from "@/context/CurrencyContext"; // Import your hook
import { ShoppingBag, AlertCircle, TrendingUp } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordSaleModal({ isOpen, onClose, onSuccess }: Props) {
  const { formatPrice, currencyCode } = useCurrency(); // Consume global context
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      productService.getProducts().then(setProducts);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const safeQuantity = Number(quantity) || 0;
  
  const totalPrice = selectedProduct ? selectedProduct.price * safeQuantity : 0;
  const totalCost = selectedProduct ? (selectedProduct.cost_price || 0) * safeQuantity : 0;
  const estimatedProfit = totalPrice - totalCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Please select a product");
    if (safeQuantity <= 0) return alert("Please enter a valid quantity");
    if (selectedProduct && safeQuantity > selectedProduct.stock) return alert("Insufficient stock!");
    
    setLoading(true);
    try {
      await salesService.recordSale({
        product_id: selectedProductId,
        quantity: safeQuantity,
        total_price: totalPrice,
        // Optional: you could pass currencyCode here if your DB tracks sale currency
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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={iconBoxStyle}><ShoppingBag size={20} /></div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>Record Sale</h2>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle}>Product to Sell</label>
            <select 
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a product from inventory</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} ({formatPrice(p.price)}) — {p.stock} available
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Quantity</label>
            <div style={{ position: "relative" }}>
              <input 
                type="number" 
                min="1"
                max={selectedProduct?.stock || 1}
                value={quantity} 
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? "" : parseInt(val));
                }}
                style={inputStyle}
              />
              {selectedProduct && safeQuantity > selectedProduct.stock && (
                <div style={stockWarningStyle}>
                  <AlertCircle size={12} /> Exceeds stock
                </div>
              )}
            </div>
          </div>

          <div style={summaryBoxStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={summaryLabelStyle}>Total Revenue</span>
              <span style={summaryValueStyle}>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
              <span style={summaryLabelStyle} className="flex items-center gap-1">
                <TrendingUp size={12} /> Est. Profit
              </span>
              <span style={{ ...summaryValueStyle, color: "#16a34a" }}>
                +{formatPrice(estimatedProfit)}
              </span>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button 
                type="submit" 
                disabled={loading || !selectedProduct || safeQuantity <= 0 || safeQuantity > selectedProduct.stock} 
                style={submitButtonStyle}
            >
              {loading ? "Processing..." : "Confirm Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ... (Styles stay exactly as they were in your snippet)
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" };
const modalStyle = { backgroundColor: "white", padding: "32px", borderRadius: "24px", width: "95%", maxWidth: "480px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" };
const iconBoxStyle = { backgroundColor: "#f1f5f9", padding: 10, borderRadius: 12, color: "#6366f1" };
const formStyle = { display: "flex", flexDirection: "column" as const, gap: "20px" };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 8 };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", transition: "all 0.2s" };
const summaryBoxStyle = { padding: "20px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" };
const summaryLabelStyle = { fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.025em" };
const summaryValueStyle = { fontSize: "16px", fontWeight: 800, color: "#0f172a" };
const stockWarningStyle: React.CSSProperties = { position: "absolute", right: "12px", top: "12px", fontSize: "10px", fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 };
const buttonGroupStyle = { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" };
const submitButtonStyle = { padding: "12px 24px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s" };
const cancelButtonStyle = { padding: "12px 24px", backgroundColor: "transparent", color: "#64748b", border: "none", fontWeight: "600", cursor: "pointer" };