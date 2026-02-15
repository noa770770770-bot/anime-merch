"use client";
"use client";

import { useRef, useState, ReactNode, PointerEvent } from "react";
import { useEditor } from "./EditorProvider";

type ModelNode = {
  position: { x: number; y: number };
  props: Record<string, any>;
};
type Model = {
  id: string;
  nodes: Record<string, ModelNode>;
};

interface EditableBlockProps {
  nodeId: string;
  children: ReactNode;
}

export default function EditableBlock({ nodeId, children }: EditableBlockProps) {
  const { isEditor, selectedId, setSelectedId, model, updateNode, setEditingId } = useEditor();
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);

  // Ensure node is initialized in model
  const typedModel = model as Model | null;
  if (isEditor && typedModel && typedModel.nodes && !typedModel.nodes[nodeId]) {
    updateNode(nodeId, { position: { x: 0, y: 0 }, props: {} });
  }
  const node = typedModel?.nodes?.[nodeId] || { position: { x: 0, y: 0 }, props: {} };
  const pos = node.position || { x: 0, y: 0 };

  // If not in editor mode, just render children
  if (!isEditor) return <>{children}</>;

  // Drag handle pointer events
  function handlePointerDown(e: PointerEvent<HTMLSpanElement>) {
    e.stopPropagation();
    setSelectedId(nodeId);
    start.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    setDragging(true);
    (e.target as HTMLSpanElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging || !start.current) return;
    updateNode(nodeId, {
      position: {
        x: e.clientX - start.current.x,
        y: e.clientY - start.current.y,
      },
    });
  }

  function handlePointerUp() {
    setDragging(false);
    start.current = null;
  }

  function handleDuplicate(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!typedModel || !typedModel.nodes[nodeId]) return;
    const id = crypto.randomUUID();
    const orig = typedModel.nodes[nodeId];
    updateNode(id, {
      position: { x: (orig.position?.x || 0) + 40, y: (orig.position?.y || 0) + 40 },
      props: { ...orig.props, text: (orig.props?.text || "") + " (copy)" },
    });
    setSelectedId(id);
    setEditingId && setEditingId(id + ".text");
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!typedModel || !typedModel.nodes[nodeId]) return;
    const next: Model = { ...typedModel, nodes: { ...typedModel.nodes } };
    delete next.nodes[nodeId];
    fetch(`/api/pages/${typedModel.id}/draft`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: next }),
    });
    setSelectedId(null);
  }

  return (
    <div
      data-node-id={nodeId}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        pointerEvents: "auto",
        userSelect: "none",
        position: "relative",
        background: hover ? "rgba(0,0,255,.08)" : "rgba(0,0,255,.03)",
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        outline: selectedId === nodeId ? "2px solid #4c9ffe" : "none",
        transition: 'background 0.15s',
      }}
    >
      {/* Hover toolbar */}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: -32,
            left: 8,
            display: "flex",
            alignItems: "center",
            background: "#111",
            color: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px #0003",
            padding: "2px 8px",
            zIndex: 10,
            fontSize: 16,
            gap: 8,
            height: 28,
          }}
        >
          {/* Drag handle */}
          <span
            style={{
              cursor: "grab",
              fontSize: 20,
              userSelect: "none",
              padding: "0 6px",
              display: "flex",
              alignItems: "center",
            }}
            onPointerDown={handlePointerDown}
          >
            &#9776;
          </span>
          {/* Duplicate block button */}
          <button
            style={{
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              cursor: "pointer",
              padding: "0 8px",
              height: 24,
              display: "flex",
              alignItems: "center",
            }}
            title="Duplicate block"
            onClick={handleDuplicate}
          >
            ⧉
          </button>
          {/* Delete block button */}
          <button
            style={{
              background: "#a22",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              cursor: "pointer",
              padding: "0 8px",
              height: 24,
              display: "flex",
              alignItems: "center",
            }}
            title="Delete block"
            onClick={handleDelete}
          >
            🗑
          </button>
        </div>
      )}
      {children}
    </div>
  );
}
