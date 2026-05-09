"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import StatCard from "@/components/dashboard/StatCard"; // Clean import

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const data = await productService.getDashboardSummary();
          setStats(data);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) return <p>Loading Dashboard...</p>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: "#666" }}>Logged in as: {user?.email}</p>
      </header>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: 20 
      }}>
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Total Stock Units" value={stats.totalStock} />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockItems} 
          color="red" 
          borderColor="red" 
        />
      </div>
    </div>
  );
}