"use client";
import { useState } from "react";

export default function DragDropEditor({ children }: { children: React.ReactNode }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [layout, setLayout] = useState<string[]>([]);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function onDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (draggedId == null) return;
    const newLayout = layout.filter((i) => i !== draggedId);
    newLayout.splice(idx, 0, draggedId);
    setLayout(newLayout);
    setDraggedId(null);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function checkPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Incorrect password');
        return;
      }
      setAuthed(true);
    } catch (err: any) {
      setError('Network error');
    }
  }

  if (!authed) {
    return (
      <form onSubmit={checkPassword} style={{ maxWidth: 320, margin: "40px auto", background: "#23232b", padding: 24, borderRadius: 12, boxShadow: "0 0 12px #0006" }}>
        <h3 style={{ color: "#f59e42", marginBottom: 12 }}>Admin Password Required</h3>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Enter admin password"
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", marginBottom: 12, fontSize: 18 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 8, background: "#f59e42", color: "#fff", fontWeight: 700, fontSize: 18 }}>Unlock Editing</button>
        {error && <div style={{ color: "#f472b6", marginTop: 8 }}>{error}</div>}
      </form>
    );
  }

  // Example: wrap children in draggable containers
  const items = Array.isArray(children) ? children : [children];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((child, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) => onDragStart(e, String(idx))}
          onDrop={(e) => onDrop(e, idx)}
          onDragOver={onDragOver}
          style={{ border: draggedId === String(idx) ? "2px dashed #f59e42" : "2px solid #eee", borderRadius: 8, padding: 8, background: "#18181b" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
