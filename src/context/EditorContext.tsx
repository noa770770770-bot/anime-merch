"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { EditorState, PageModel } from "@/types/pageModel";
import { defaultPageModel } from "@/lib/pageModelDefaults";

type EditorContextType = {
  state: EditorState;
  setState: (s: EditorState) => void;
  dispatch: (cmd: EditorCommand) => void;
  activePagePath: string;
};

const EditorContext = createContext<EditorContextType>({
  state: { page: defaultPageModel, selectedId: null, history: [], future: [], isDragging: false, dragPreview: null },
  setState: () => {},
  setActivePagePath: () => {},
});

export type EditorCommand =
  | { type: "select"; id: string | null }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "addElement"; containerId: string; element: any }
  | { type: "removeElement"; id: string }
  // EditorContext removed as requested. No edit functionality remains.
  const [state, setState] = useState<EditorState>(() => {
        try {
        try {
  }, [state.page, activePagePath]);
    if (cmd.type === "undo") {
        const newHistory = s.history.slice(0, -1);
      });
  // All editing logic and state have been removed from EditorContext.
      setState(s => {
        if (s.future.length === 0) return s;
        const next = s.future[0];
        const newFuture = s.future.slice(1);
        return {
          ...s,
          page: next,
          history: [...s.history, s.page],
          future: newFuture,
        };
      });
      return;
    }
    if (cmd.type === "dragStart") {
      setState(s => ({ ...s, isDragging: true, dragPreview: { id: cmd.id, x: 0, y: 0 } }));
      return;
    }
    if (cmd.type === "dragPreview") {
      setState(s => ({ ...s, dragPreview: { id: cmd.id, x: cmd.x, y: cmd.y } }));
      return;
    }
    if (cmd.type === "dragEnd") {
      setState(s => ({ ...s, isDragging: false, dragPreview: null }));
      return;
    }
    if (cmd.type === "move") {
      setState(s => {
        // Find and update the element's layout, with constraints
        const page = JSON.parse(JSON.stringify(s.page));
        for (const section of page.sections) {
          for (const container of section.containers) {
            for (const el of container.elements) {
              if (el.id === cmd.id) {
                // Constraint: keep inside container
                const minX = 0;
                const minY = 0;
                const maxX = container.layout.width - el.layout.width;
                const maxY = container.layout.height - el.layout.height;
                el.layout.x = Math.max(minX, Math.min(cmd.x, maxX));
                el.layout.y = Math.max(minY, Math.min(cmd.y, maxY));
              }
            }
          }
        }
        return { ...s, history: [...s.history, s.page], future: [], page };
      });
      return;
    }
    if (cmd.type === "setText") {
      setState(s => {
        const page = JSON.parse(JSON.stringify(s.page));
        for (const section of page.sections) {
          for (const container of section.containers) {
            for (const el of container.elements) {
              if (el.id === cmd.id) {
                el.props.text = cmd.text;
              }
            }
          }
        }
        return { ...s, history: [...s.history, s.page], future: [], page };
      });
      return;
    }
    // TODO: implement other command logic (resize, etc.)
  }

  return (
    <EditorContext.Provider value={{ state, setState, dispatch, activePagePath, setActivePagePath }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}
