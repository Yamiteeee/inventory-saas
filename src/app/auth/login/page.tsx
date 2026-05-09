// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { authService } from "@/services/authService"; // Using our new service
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Good practice to use forms even for login
    setLoading(true);

    try {
      await authService.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10, marginBottom: 10, width: "100%" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, marginBottom: 10, width: "100%" }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          background: loading ? "#ccc" : "black",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}