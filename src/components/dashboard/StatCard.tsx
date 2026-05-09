interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
  borderColor?: string;
}

export default function StatCard({ title, value, color = "black", borderColor = "#ddd" }: StatCardProps) {
  return (
    <div style={{ 
      padding: 20, 
      border: "1px solid #ddd", 
      borderLeft: borderColor !== "#ddd" ? `5px solid ${borderColor}` : "1px solid #ddd",
      borderRadius: 8 
    }}>
      <h3 style={{ margin: 0, fontSize: "1rem", color: "#666" }}>{title}</h3>
      <p style={{ margin: "10px 0 0 0", fontSize: "2rem", fontWeight: "bold", color }}>
        {value}
      </p>
    </div>
  );
}