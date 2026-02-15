// Shared Renderer for both runtime and editor preview


import { PageModel, Breakpoint, ElementNode } from "./page-model";
import { EditableBox } from "./EditableBox";
import { InlineText } from "./InlineText";

export function Renderer({ model, bp, mode, selectedId, setSelectedId, editingNodeId, setEditingNodeId, onChangeFrame, onCommitMove, setModelState }: {
  model: PageModel;
  bp: Breakpoint;
  mode?: "runtime" | "editor";
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  editingNodeId?: string | null;
  setEditingNodeId?: (id: string | null) => void;
  onChangeFrame?: (rect: any, nodeId?: string) => void;
  onCommitMove?: (nodeId: string, x: number, y: number) => void;
  setModelState?: (fn: (prev: any) => any) => void;
}) {
  const root = model.nodes[model.rootId];
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      <PageBackground model={model} />
      <RenderNode model={model} nodeId={root.id} bp={bp} mode={mode} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  );
}

function Editable({ nodeId, children, selectedId, setSelectedId, node, onChangeFrame, onCommitMove, editingNodeId }: {
  nodeId: string;
  children: React.ReactNode;
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  node: any;
  onChangeFrame?: (rect: any, nodeId?: string) => void;
  onCommitMove?: (nodeId: string, x: number, y: number) => void;
  editingNodeId?: string | null;
}) {
  const selected = selectedId === nodeId;
  const editing = editingNodeId === nodeId;
  const frame = node.frame.desktop;
  // Always wrap in EditableBox in editor mode, but only show handles if selected and not editing
  const handleChange = (rect: any) => onChangeFrame?.(rect, nodeId);
  const handleCommit = (x: number, y: number) => onCommitMove?.(nodeId, x, y);
  return (
    <EditableBox rect={frame} selected={selected && !editing} onChange={handleChange} onCommit={handleCommit} dragDisabled={editing}>
      <div
        data-node-id={nodeId}
        onPointerDown={e => { e.stopPropagation(); setSelectedId?.(nodeId); }}
        style={{ outline: selected ? "1px solid #4c9ffe" : "none", pointerEvents: "auto" }}
      >
        {children}
      </div>
    </EditableBox>
  );
}

function RenderNode({ model, nodeId, bp, mode, selectedId, setSelectedId, editingNodeId, setEditingNodeId, onChangeFrame, onCommitMove, setModelState }: any) {
  const node = model.nodes[nodeId];
  const frame = node.frame[bp];
  const commonStyle: React.CSSProperties = {
    position: "absolute",
    left: frame.x,
    top: frame.y,
    width: frame.w,
    height: frame.h,
  };
  const wrap = (el: React.ReactNode) =>
    mode === "editor"
      ? <Editable nodeId={nodeId} selectedId={selectedId} setSelectedId={setSelectedId} node={node} onChangeFrame={onChangeFrame} onCommitMove={onCommitMove} editingNodeId={editingNodeId}>{el}</Editable>
      : el;
  switch (node.type) {
    case "text":
      return wrap(
        <InlineText
          value={node.props.text}
          editing={editingNodeId === nodeId}
          onStart={() => { setEditingNodeId?.(nodeId); setSelectedId?.(nodeId); }}
          onCommit={v => {
            setModelState?.((prev: any) => {
              const next = { ...prev, nodes: { ...prev.nodes } };
              next.nodes[nodeId] = { ...prev.nodes[nodeId], props: { ...prev.nodes[nodeId].props, text: v } };
              return next;
            });
            setEditingNodeId?.(null);
          }}
        />
      );
    case "image":
      return wrap(
        <img
          style={{ ...commonStyle, objectFit: node.style.fill?.kind === "image" ? node.style.fill.fit : "cover" }}
          src={node.props.src}
          alt={node.props.alt ?? ""}
        />
      );
    case "container":
      const children: ElementNode[] = Object.values(model.nodes).filter((n): n is ElementNode => (n as ElementNode).parentId === node.id);
      return wrap(
        <div style={{ ...commonStyle }}>
          {children.map((c) => (
            <RenderNode key={c.id} model={model} nodeId={c.id} bp={bp} mode={mode} selectedId={selectedId} setSelectedId={setSelectedId} onChangeFrame={onChangeFrame} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function textStyle(node: any): React.CSSProperties {
  const t = node.style.text;
  return t
    ? { fontFamily: t.fontFamily, fontSize: t.fontSize, fontWeight: t.fontWeight, color: t.color, textAlign: t.align }
    : {};
}

function PageBackground({ model }: { model: PageModel }) {
  const fill = model.background.fill;
  const base: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: -10,
  };
  if (fill.kind === "color") return <div style={{ ...base, background: fill.value }} />;
  if (fill.kind === "image")
    return <div style={{ ...base, backgroundImage: `url(${fill.src})`, backgroundSize: fill.fit, backgroundPosition: "center" }} />;
  if (fill.kind === "video")
    return (
      <video style={{ ...base, width: "100%", height: "100%", objectFit: "cover" }} autoPlay muted loop playsInline src={fill.src} />
    );
  return null;
}
