"use client";
import { useEffect, useState } from "react";

export function useUserStats() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/stats/users");
        if (!res.ok) throw new Error("Failed to fetch user stats");
        const data = await res.json();
        setCount(data.count);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { count, loading, error };
}
