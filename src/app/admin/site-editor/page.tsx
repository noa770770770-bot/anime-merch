"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EditorShell = dynamic(() => import("@/editor/EditorShell"), { ssr: false });

const DEFAULT_PAGES = [
  { id: "home", title: "Home" },
  { id: "products", title: "Products" },
  { id: "faq", title: "FAQ" },
];

export default function SiteEditorPage() {
  const [pages, setPages] = useState(DEFAULT_PAGES);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageId, setNewPageId] = useState("");

  useEffect(() => {
    if (!selectedPageId) return;
    setLoading(true);
    fetch(`/api/pages/${selectedPageId}?version=draft`)
      .then(res => res.json())
      .then(data => {
        setModel(data.model);
        setLoading(false);
      });
  }, [selectedPageId]);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageId || !newPageTitle) return;
    // Create a minimal page model
    const newModel = {
      id: newPageId,
      title: newPageTitle,
      rootId: `${newPageId}.root`,
      nodes: {
        [`${newPageId}.root`]: {
          id: `${newPageId}.root`,
          type: "container",
          parentId: null,
          frame: { desktop: { x: 0, y: 0, w: 1200, h: 600 } },
          style: {},
          props: {},
        },
      },
      background: { fill: { kind: "color", value: "#23232b" } },
    };
    // Save to draft store
    await fetch(`/api/pages/${newPageId}/draft`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: newModel }),
    });
    setPages(p => [...p, { id: newPageId, title: newPageTitle }]);
    setSelectedPageId(newPageId);
    setNewPageId("");
    setNewPageTitle("");
  };

  return (
    <div style={{ display: "flex", minHeight: 500 }}>
      <div style={{ width: 320, background: "#18181b", color: "#fff", padding: 16, borderRadius: 12 }}>
        <h2>Site Editor</h2>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Select Page</div>
          <select
            value={selectedPageId || ''}
            onChange={e => setSelectedPageId(e.target.value || null)}
            style={{ width: "100%", padding: 8, borderRadius: 4, marginBottom: 8 }}
          >
            <option value="">-- Select a page --</option>
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
            ))}
          </select>
        </div>
        <form onSubmit={handleCreatePage} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Create New Page</div>
          <input
            placeholder="Page Title"
            value={newPageTitle}
            onChange={e => setNewPageTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 4, padding: 6, borderRadius: 4 }}
          />
          <input
            placeholder="Page ID (url)"
            value={newPageId}
            onChange={e => setNewPageId(e.target.value.replace(/\s+/g, '-').toLowerCase())}
            style={{ width: "100%", marginBottom: 8, padding: 6, borderRadius: 4 }}
          />
          <button type="submit" style={{ width: "100%", padding: 8, background: "#4c9ffe", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Create Page
          </button>
        </form>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          <div>Tip: You can edit any page, or create new ones for landing pages, FAQs, etc.</div>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", minHeight: 500 }}>
        {!selectedPageId ? (
          <div style={{ padding: 32, color: '#aaa', textAlign: 'center' }}>Select a page to start editing.</div>
        ) : loading || !model ? (
          <div style={{ padding: 32 }}>Loading editor...</div>
        ) : (
          <EditorShell model={model} pageId={selectedPageId} />
        )}
      </div>
    </div>
  );
}
