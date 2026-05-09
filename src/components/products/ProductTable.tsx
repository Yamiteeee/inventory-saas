import { Product } from "@/services/productService";

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  return (
    <div style={{ overflowX: "auto", marginTop: "20px" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={trStyle}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}>${p.price.toFixed(2)}</td>
              <td style={tdStyle}>{p.stock}</td>
              <td style={tdStyle}>
                {p.stock <= p.low_stock_threshold ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>Low Stock</span>
                ) : (
                  <span style={{ color: "green" }}>In Stock</span>
                )}
              </td>
              <td style={tdStyle}>
                <button 
                  onClick={() => p.id && onDelete(p.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", backgroundColor: "white" };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "12px", borderBottom: "2px solid #eee", color: "#666" };
const tdStyle: React.CSSProperties = { padding: "12px", borderBottom: "1px solid #eee" };
const trStyle: React.CSSProperties = { transition: "0.2s" };
const deleteButtonStyle = { color: "red", background: "none", border: "none", cursor: "pointer" };