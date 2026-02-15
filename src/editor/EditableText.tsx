"use client";
import { useEditor } from "@/editor/EditorProvider";

export function EditableText({ nodeId, value }: { nodeId: string; value: string }) {
    console.log("EditableText render, isEditor:", useEditor().isEditor);
  const { selectedId, setSelectedId, editingId, setEditingId, updateNode, isEditor } = useEditor();
  const node = { props: { text: value } };
  const selected = selectedId === nodeId;
  const editing = editingId === nodeId;

  if (!isEditor) return <span>{node.props.text}</span>;

  return editing ? (
    <input
      value={node.props.text}
      autoFocus
      onChange={e => updateNode(nodeId, { text: e.target.value })}
      onBlur={() => setEditingId(null)}
      style={{ outline: '2px solid #4c9ffe', fontWeight: 700, fontSize: 18 }}
    />
  ) : (
    <span
      data-node-id={nodeId}
      onClick={() => setSelectedId(nodeId)}
      onDoubleClick={() => setEditingId(nodeId)}
      style={{ outline: selected ? '2px solid #4c9ffe' : 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18 }}
    >
      {node.props.text}
    </span>
  );
}
