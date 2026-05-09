"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to highlight active links
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/dashboard/products" },
    { name: "Sales", href: "/dashboard/sales" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: "20px", fontWeight: "bold", fontSize: "1.2rem" }}>
        Inventory SaaS
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...linkStyle,
              backgroundColor: isActive(item.href) ? "#333" : "transparent",
              color: isActive(item.href) ? "white" : "#ccc",
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button 
        onClick={() => authService.logout()} 
        style={logoutButtonStyle}
      >
        Sign Out
      </button>
    </aside>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: "250px",
  height: "100vh",
  backgroundColor: "#1a1a1a",
  color: "white",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  left: 0,
  top: 0,
};

const linkStyle: React.CSSProperties = {
  padding: "12px 20px",
  textDecoration: "none",
  fontSize: "1rem",
  transition: "0.2s",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "transparent",
  color: "#ff4d4d",
  border: "none",
  borderTop: "1px solid #333",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: "bold",
};