import EditorClient from "./EditorClient";

export default async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = typeof params.then === "function" ? await params : params;
  return <EditorClient id={resolvedParams.id} />;
}
