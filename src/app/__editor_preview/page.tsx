"use client";
import { useEffect, useState } from "react";
import { Renderer } from "@/editor/Renderer";

async function fetchDraftModel(pageId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/pages/${pageId}?version=draft`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.model;
}

export default function Preview({ searchParams }: { searchParams: { pageId: string } }) {
  const pageId = searchParams.pageId || "home";
  const [model, setModel] = useState<any | null>(null);

  // Initial fetch
  useEffect(() => {
    fetchDraftModel(pageId).then(setModel);
  }, [pageId]);

  // Listen for postMessage updates from parent
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "UPDATE_MODEL" && e.data.model) {
        setModel(e.data.model);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!model) return <div>Draft not found for {pageId}</div>;
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <div style={{ position: "absolute", top: 8, right: 16, zIndex: 10, background: "#2ecc40", color: "#fff", padding: "2px 10px", borderRadius: 6, fontSize: 13, fontWeight: 600, opacity: 0.85 }}>
        Draft Preview
      </div>
      <Renderer model={model} bp="desktop" mode="runtime" />
    </div>
  );
}
