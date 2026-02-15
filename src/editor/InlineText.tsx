// Inline plain text editor for Wix-style editing
import React, { useState } from "react";

export function InlineText({
  value,
  editing,
  onStart,
  onCommit,
}: {
  value: string;
  editing: boolean;
  onStart: () => void;
  onCommit: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  if (!editing) {
    return <div onDoubleClick={onStart} style={{ cursor: "text" }}>{value}</div>;
  }
  return (
    <input
      autoFocus
      value={text}
      onChange={e => setText(e.target.value)}
      onBlur={() => onCommit(text)}
      onKeyDown={e => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") onCommit(value);
      }}
      style={{ width: "100%", font: "inherit", border: "1px dashed #4c9ffe" }}
    />
  );
}
