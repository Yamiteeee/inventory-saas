export default function StatCard({ title, value, color = "#1e293b", borderColor = "#e2e8f0" }: any) {
  return (
    <div style={{ 
      padding: "24px", 
      backgroundColor: "white",
      border: "1px solid #e2e8f0", 
      borderLeft: `6px solid ${borderColor}`,
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    }}>
      <h3 style={{ margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </h3>
      <p style={{ margin: "12px 0 0 0", fontSize: "2.25rem", fontWeight: "700", color }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}