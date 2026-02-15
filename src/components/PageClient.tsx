"use client";

import { useSearchParams } from "next/navigation";
import { EditorProvider } from "@/editor/EditorProvider";
import { EditableText } from "@/editor/EditableText";
import { useAdmin } from "@/hooks/useAdmin";

interface PageClientProps {
  route: string;
  defaultPageId: string;
  children?: React.ReactNode;
}

export default function PageClient({ route, defaultPageId, children = null }: PageClientProps) {
  const searchParams = useSearchParams();
  const isAdmin = useAdmin();

  const isEditor = searchParams.get("__editor") === "1" && isAdmin === true;
  const pageId = searchParams.get("pageId") ?? defaultPageId;

  return (
    <EditorProvider pageId={pageId} route={route} isEditor={isEditor}>
      {children}
    </EditorProvider>
  );
}
