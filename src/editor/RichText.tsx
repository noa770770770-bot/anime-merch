// Rich text editor placeholder (Tiptap or Lexical recommended for production)
import React from "react";

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // TODO: Integrate Tiptap or Lexical for full-featured rich text editing
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: "100%", minHeight: 80, font: "inherit", border: "1px dashed #4c9ffe" }}
    />
  );
}
