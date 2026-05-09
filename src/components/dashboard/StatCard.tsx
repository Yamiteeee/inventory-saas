interface Props {
  title: string;
  value: number | string;
  color?: string;
  borderColor?: string;
  onClick?: () => void; // Added onClick prop
}

export default function StatCard({ title, value, color = "#1e293b", borderColor = "#e2e8f0", onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      style={{
        ...cardStyle,
        borderColor: borderColor,
        cursor: onClick ? "pointer" : "default",
      }}
      className="stat-card"
    >
      <h3 style={titleStyle}>{title}</h3>
      <p style={{ ...valueStyle, color }}>{value}</p>
      {onClick && <span style={hintStyle}>Click to view details →</span>}
      
      <style jsx>{`
        .stat-card {
          transition: all 0.2s ease-in-out;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          background-color: #f8fafc;
        }
      `}</style>
    </div>
  );
}

const cardStyle = {
  padding: "24px",
  backgroundColor: "white",
  borderRadius: "16px",
  border: "1px solid",
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const titleStyle = { margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.025em" };
const valueStyle = { margin: 0, fontSize: "2rem", fontWeight: "800" };
const hintStyle = { fontSize: "0.75rem", color: "#94a3b8", marginTop: "8px" };