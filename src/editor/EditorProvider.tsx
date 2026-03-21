
 "use client";
 
 import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
export const EditorContext = createContext({
  pageId: "",
  route: "",
  selectedId: null as string | null,
  editingId: null as string | null,
  setSelectedId: (id: string | null) => {},
  setEditingId: (id: string | null) => {},
  updateNode: (id: string, props: any) => {},
  commit: () => {},
  isEditor: false,
  model: null,
  addTextBlock: () => {},
});

export function EditorProvider({ pageId, route, isEditor, children }: { pageId: string; route: string; isEditor: boolean; children: React.ReactNode }) {
    console.log("EditorProvider isEditor:", isEditor);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  useEffect(() => {
    if (!isEditor || !pageId) return;
    fetch(`/api/pages/${pageId}?version=draft`).then(res => res.json()).then(data => setModel(data.model));
  }, [isEditor, pageId]);
  // Debounced save
  useEffect(() => {
    if (!isEditor || !pageId || !model) return;
    const timer = setTimeout(() => {
      fetch(`/api/pages/${pageId}/draft`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [model, isEditor, pageId]);
  const updateNode = useCallback((id: string, props: any) => {
    setModel((prev: any) => {
      const next = { ...prev, nodes: { ...prev.nodes } };
      next.nodes[id] = { ...prev.nodes[id], props: { ...prev.nodes[id].props, ...props } };
      return next;
    });
  }, []);

  const addTextBlock = useCallback(() => {
    const id = crypto.randomUUID();
    updateNode(id, {
      position: { x: 40, y: 40 },
      props: { text: "New text" },
    });
    setSelectedId(id);
  }, [updateNode]);
  const commit = useCallback(() => {
    // Implement commit logic
  }, []);
  return (
    <EditorContext.Provider value={{ pageId, route, selectedId, editingId, setSelectedId, setEditingId, updateNode, commit, isEditor, model, addTextBlock }}>
      {children}
    </EditorContext.Provider>
  );
}


export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within <EditorProvider>");
  return ctx;
}
