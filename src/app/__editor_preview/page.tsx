import { Renderer } from "@/editor/Renderer";

async function fetchDraftModel(pageId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/pages/${pageId}?version=draft`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.model;
}

export default async function Preview({ searchParams }: { searchParams: { pageId: string } }) {
  const pageId = searchParams.pageId || "home";
  const model = await fetchDraftModel(pageId);
  if (!model) return <div>Draft not found for {pageId}</div>;
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Renderer model={model} bp="desktop" mode="runtime" />
    </div>
  );
}
