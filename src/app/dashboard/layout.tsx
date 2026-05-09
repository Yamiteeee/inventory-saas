import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Sidebar />

      <main style={{ 
        flex: 1, 
        marginLeft: "250px", 
        backgroundColor: "#f8fafc", // Professional Slate 50
        color: "#1e293b",           // Professional Slate 800 (Very Dark Blue/Gray)
        padding: "40px",            // More breathing room for a "Pro" feel
        minHeight: "100vh",
      }}>
        {children}
      </main>
    </div>
  );
}