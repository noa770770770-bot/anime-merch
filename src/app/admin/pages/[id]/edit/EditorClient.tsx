"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EditorShell = dynamic(() => import("@/editor/EditorShell"), { ssr: false });

export default function EditorClient({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    async function fetchDraft() {
      setLoading(true);
      const res = await fetch(`/api/pages/${id}?version=draft`);
      if (!res.ok) return;
      const data = await res.json();
      setModel(data.model);
      setLoading(false);
    }
    fetchDraft();
  }, [id]);

  if (loading) return <div>Loading editor...</div>;
  if (!model) return <div>Draft not found</div>;
  return <EditorShell model={model} pageId={id} />;
}