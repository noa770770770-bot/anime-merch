import Link from "next/link";


const pages = [
  { id: "home", title: "Home" },
  { id: "products", title: "Products" },
  { id: "faq", title: "FAQ" },
];

export default function AdminPagesList() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Pages</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Title</th>
            <th style={{ textAlign: "left" }}>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pages.map(page => (
            <tr key={page.id}>
              <td>{page.title}</td>
              <td>{page.id}</td>
              <td>
                <Link href={`/${page.id === 'home' ? '' : page.id + '?__editor=1&pageId=' + page.id}`}>Edit {page.title}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
