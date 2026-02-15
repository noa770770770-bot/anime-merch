// EditableBox using react-rnd for drag/resize
import React from "react";
import { Rnd } from "react-rnd";

export function EditableBox({
  rect,
  selected,
  onChange,
  onCommit,
  dragDisabled,
  children,
}: {
  rect: { x: number; y: number; w: number; h: number };
  selected: boolean;
  onChange: (next: { x: number; y: number; w: number; h: number }) => void;
  onCommit?: (x: number, y: number) => void;
  dragDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Rnd
      size={{ width: rect.w, height: rect.h }}
      position={{ x: rect.x, y: rect.y }}
      onDrag={(e, d) => onChange({ ...rect, x: d.x, y: d.y })}
      onDragStop={(e, d) => {
        onChange({ ...rect, x: d.x, y: d.y });
        onCommit?.(d.x, d.y);
      }}
      onResize={(e, dir, ref, delta, pos) =>
        onChange({ x: pos.x, y: pos.y, w: ref.offsetWidth, h: ref.offsetHeight })
      }
      enableResizing={selected && !dragDisabled}
      disableDragging={dragDisabled || !selected}
      style={{ outline: selected ? "1px solid #4c9ffe" : "none", pointerEvents: "none" }}
    >
      <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>{children}</div>
    </Rnd>
  );
}
