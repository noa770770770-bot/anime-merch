"use client";
import React, { useState, useRef, useEffect } from "react";
import { AutosaveManager } from "./autosave";
import { Renderer } from "./Renderer";

export default function EditorShell({ model, pageId }: { model: any; pageId?: string }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [modelState, setModelState] = useState(model);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const autosaveRef = useRef<AutosaveManager | null>(null);
  const previewRef = useRef<HTMLIFrameElement | null>(null);

  // Handler for drag/resize preview (optional, for visual feedback)
  function handleChangeFrame(rect: any, nodeId?: string) {
    if (!nodeId) nodeId = selectedId;
    if (!nodeId) return;
    setModelState((prev: any) => {
      const next = { ...prev, nodes: { ...prev.nodes } };
      next.nodes[nodeId] = {
        ...prev.nodes[nodeId],
        frame: {
          ...prev.nodes[nodeId].frame,
          desktop: { ...rect },
        },
      };
      return next;
    });
  }

  // Commit drag (canonical update)
  function commitMove(nodeId: string, newX: number, newY: number) {
    setModelState((prev: any) => {
      const next = structuredClone(prev);
      next.nodes[nodeId].frame.desktop.x = newX;
      next.nodes[nodeId].frame.desktop.y = newY;
      return next;
    });
    // Autosave will queue automatically
  }

  // Setup autosave manager
  useEffect(() => {
    if (!pageId) return;
    if (!autosaveRef.current) {
      autosaveRef.current = new AutosaveManager(async (m) => {
        await fetch(`/api/pages/${pageId}/draft`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: m }),
        });
      });
    }
  }, [pageId]);

  // Live preview messaging
  useEffect(() => {
    if (showPreview && previewRef.current) {
      previewRef.current.contentWindow?.postMessage({ type: "UPDATE_MODEL", model: modelState }, "*");
    }
  }, [modelState, showPreview]);

  // Queue autosave on modelState change
  useEffect(() => {
    if (autosaveRef.current) {
      autosaveRef.current.queueSave(modelState);
    }
  }, [modelState]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 280, background: "#18181b", color: "#fff", padding: 16 }}>
        <h2>Editor Panel</h2>
        <div>Selected: {selectedId}</div>
        <button
          style={{ margin: "16px 0", padding: "8px 16px", background: "#4c9ffe", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={async () => {
            if (!pageId) return;
            const res = await fetch(`/api/pages/${pageId}/publish`, { method: "POST" });
            if (res.ok) alert("Page published!");
            else alert("Publish failed");
          }}
        >
          Publish
        </button>
        <button
          style={{ margin: "8px 0", padding: "8px 16px", background: "#2ecc40", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={() => {
            const id = crypto.randomUUID();
            setModelState(prev => {
              const frame = { x: 200, y: 120, w: 240, h: 60 };
              const node = {
                id,
                type: "text",
                parentId: prev.rootId,
                frame: {
                  desktop: frame,
                  tablet: frame,
                  mobile: frame,
                },
                style: { text: { fontFamily: "Inter", fontSize: 24, fontWeight: 700, color: "#111", align: "center" } },
                props: { text: "New text" },
              };
              return {
                ...prev,
                nodes: { ...prev.nodes, [id]: node },
              };
            });
            setSelectedId(id);
          }}
        >
          Add Text
        </button>
        <button
          style={{ margin: "8px 0", padding: "8px 16px", background: "#232946", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? "Hide" : "Show"} Editor Preview
        </button>
        <button
          style={{ margin: "8px 0", padding: "8px 16px", background: showLive ? "#ffb347" : "#232946", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          onClick={() => setShowLive((v) => !v)}
        >
          {showLive ? "Show Editor Model" : "Show Live Homepage"}
        </button>
        {/* Save/Publish buttons, history, etc. */}
      </div>
      <div style={{ flex: 1, position: "relative", background: "#fff" }}>
        {/* Real site preview in iframe */}
        {pageId && !showLive && (
          <iframe
            ref={previewRef}
            src={`/__editor_preview?pageId=${encodeURIComponent(pageId)}`}
            className="editorPreview"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", zIndex: 1, background: "#fff" }}
            title="Site Preview"
          />
        )}
        {showLive && (
          <iframe
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", zIndex: 1, background: "#fff" }}
            src="/"
            title="Live Homepage Preview"
          />
        )}
        {/* Editor overlays above iframe */}
        <div className="editorOverlay" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <Renderer
            model={modelState}
            bp="desktop"
            mode="editor"
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            editingNodeId={editingNodeId}
            setEditingNodeId={setEditingNodeId}
            onChangeFrame={handleChangeFrame}
            onCommitMove={commitMove}
            setModelState={setModelState}
          />
        </div>
      </div>
    </div>
  );
}
