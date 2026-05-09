"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Added for navigation
import { useAuth } from "@/hooks/useAuth";
import { productService } from "@/services/productService";
import { salesService } from "@/services/salesService";
import StatCard from "@/components/dashboard/StatCard";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter(); // Initialize router
  const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStockItems: 0 });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [statData, salesData] = await Promise.all([
            productService.getDashboardSummary(),
            salesService.getSalesHistory()
          ]);
          setStats(statData);
          setRecentSales(salesData.slice(0, 5));
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (authLoading || loading) return <p style={{ color: "#64748b", padding: "40px" }}>Loading Dashboard...</p>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Dashboard Overview</h1>
          <p style={subtitleStyle}>Logged in as: {user?.email}</p>
        </div>
        <div style={dateStyle}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>
      
      <div style={gridStyle}>
        {/* Card 1: Blue for general inventory info */}
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          color="#2563eb" 
          borderColor="#bfdbfe"
          onClick={() => router.push('/dashboard/products')}
        />
        
        {/* Card 2: Indigo/Purple for scale/volume */}
        <StatCard 
          title="Total Stock Units" 
          value={stats.totalStock} 
          color="#4f46e5" 
          borderColor="#e0e7ff"
          onClick={() => router.push('/dashboard/products?mode=audit')}
        />
        
        {/* Card 3: Red for urgent alerts */}
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockItems} 
          color="#dc2626" 
          borderColor="#fecaca" 
          onClick={() => router.push('/dashboard/products?filter=low')}
        />
      </div>

      <div style={activityContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Recent Sales</h2>
          <button style={viewAllBtn} onClick={() => router.push('/dashboard/sales')}>View All</button>
        </div>

        {recentSales.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>No recent sales found.</p>
        ) : (
          <div style={listStyle}>
            {recentSales.map((sale) => (
              <div key={sale.id} style={saleItemStyle}>
                <div style={iconCircle}>💰</div>
                <div style={{ flex: 1, marginLeft: "15px" }}>
                  <p style={saleProductText}>{sale.products?.name || "Product"}</p>
                  <p style={saleDateText}>{new Date(sale.created_at).toLocaleDateString()}</p>
                </div>
                <div style={saleAmountStyle}>
                  +${sale.total_price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles remain the same as your provided code
const containerStyle = { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" };
const titleStyle = { margin: 0, fontSize: "1.875rem", fontWeight: "700", color: "#1e293b" };
const subtitleStyle = { margin: "4px 0 0 0", color: "#64748b", fontSize: "1rem" };
const dateStyle = { color: "#64748b", fontWeight: "500", fontSize: "0.9rem" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" };
const activityContainer = { marginTop: "40px", padding: "32px", backgroundColor: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" };
const viewAllBtn = { backgroundColor: "transparent", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "8px", color: "#64748b", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" };
const listStyle = { display: "flex", flexDirection: "column" as const, gap: "12px" };
const saleItemStyle = { display: "flex", alignItems: "center", padding: "12px", borderBottom: "1px solid #f1f5f9" };
const iconCircle = { width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" };
const saleProductText = { margin: 0, fontWeight: "600", color: "#1e293b" };
const saleDateText = { margin: 0, fontSize: "0.875rem", color: "#64748b" };
const saleAmountStyle = { fontWeight: "700", color: "#16a34a" };