"use client";

import { useEffect, useState } from "react";
import { productService, Product } from "@/services/productService";
import ProductTable from "@/components/products/ProductTable";
import AddProductModal from "@/components/products/AddProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#1e293b" }}>Inventory Items</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: "10px 20px", backgroundColor: "#1e293b", color: "white", borderRadius: "8px", cursor: "pointer" }}
        >
          + Add Product
        </button>
      </div>

      <ProductTable products={products} onDelete={loadProducts} />

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadProducts} 
      />
    </div>
  );
}