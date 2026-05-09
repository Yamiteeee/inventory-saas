import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 1. Sidebar stays fixed on the left */}
      <Sidebar />

      {/* 2. Main content area shifts to the right to clear the sidebar width */}
      <main style={{ 
        flex: 1, 
        marginLeft: "250px", // Match your Sidebar width
        backgroundColor: "#f9f9f9",
        padding: "20px" 
      }}>
        {children}
      </main>
    </div>
  );
}