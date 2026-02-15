"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/account/profile");
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, fontSize: 18 }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, fontSize: 18 }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 8, background: "#f59e42", color: "#fff", fontWeight: 700, fontSize: 18 }}>Login</button>
        {error && <div style={{ color: "#f472b6", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
