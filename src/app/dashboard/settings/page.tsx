"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "");
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Logic for supabase.auth.updateUser would go here
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated! (Simulation)");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ color: "#1e293b", marginBottom: "30px" }}>Settings</h1>

      {/* Profile Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Profile Information</h2>
        <p style={sectionSub}>Update your account details and public alias.</p>
        
        <form onSubmit={handleUpdateProfile} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="text" 
              disabled 
              value={user?.email || ""} 
              style={{ ...inputStyle, backgroundColor: "#f1f5f9", cursor: "not-allowed" }} 
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              style={inputStyle} 
            />
          </div>

          <button type="submit" disabled={saving} style={saveBtn}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Preferences Section */}
      <section style={{ ...sectionStyle, marginTop: "40px" }}>
        <h2 style={sectionTitle}>Application Preferences</h2>
        <div style={preferenceRow}>
          <div>
            <p style={{ fontWeight: "600", margin: 0 }}>Email Notifications</p>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>Receive stock alerts and weekly reports.</p>
          </div>
          <input type="checkbox" defaultChecked style={checkboxStyle} />
        </div>
      </section>
    </div>
  );
}

// Styles
const sectionStyle = { backgroundColor: "white", padding: "32px", borderRadius: "12px", border: "1px solid #e2e8f0" };
const sectionTitle = { fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" };
const sectionSub = { fontSize: "0.875rem", color: "#64748b", marginBottom: "24px" };
const formStyle = { display: "flex", flexDirection: "column" as const, gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column" as const, gap: "8px" };
const labelStyle = { fontSize: "0.875rem", fontWeight: "600", color: "#475569" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "1rem", color: "#1e293b" };
const saveBtn = { width: "fit-content", padding: "12px 24px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const preferenceRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid #f1f5f9" };
const checkboxStyle = { width: "20px", height: "20px", cursor: "pointer" };