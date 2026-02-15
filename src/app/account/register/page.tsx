"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/account/login"), 1200);
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, fontSize: 18 }}
          />
        </div>
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
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 8, background: "#f472b6", color: "#fff", fontWeight: 700, fontSize: 18 }}>Register</button>
        {error && <div style={{ color: "#f472b6", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "#22c55e", marginTop: 8 }}>Registration successful! Redirecting...</div>}
      </form>
    </div>
  );
}
