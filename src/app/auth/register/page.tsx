"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService"; // Clean import

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(email, password);
      
      alert("Check your email or proceed to login");
      // Use absolute path to avoid routing bugs
      router.push("/auth/login"); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} style={formStyle}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            background: loading ? "#ccc" : "black",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

// Moving styles out of the JSX makes the logic easier to read
const containerStyle: React.CSSProperties = { 
  padding: 20, 
  maxWidth: 400, 
  margin: "0 auto" 
};

const formStyle: React.CSSProperties = { 
  display: "flex", 
  flexDirection: "column", 
  gap: 10 
};

const inputStyle: React.CSSProperties = { 
  padding: 10 
};

const buttonStyle: React.CSSProperties = {
  padding: 10,
  color: "white",
};