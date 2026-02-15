"use client";
import React, { useState, useEffect } from "react";

export default function Banner() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/banner")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  if (!visible || !message) return null;
  return (
    <div style={{
      background: "linear-gradient(90deg,#f472b6,#7c3aed)",
      color: "#fff",
      padding: "12px 0",
      textAlign: "center",
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: "0.02em",
      boxShadow: "0 2px 12px #f472b633",
      position: "relative",
      zIndex: 100
    }}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} style={{
        position: "absolute",
        right: 24,
        top: 8,
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: 22,
        cursor: "pointer"
      }} aria-label="Dismiss banner">×</button>
    </div>
  );
}
