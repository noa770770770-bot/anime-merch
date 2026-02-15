// src/app/admin/page.tsx
import Link from "next/link";

const tiles = [
  {
    title: "Products",
    desc: "Add / edit products & variants",
    href: "/admin/products",
    cta: "Manage Products",
    quick: [{ label: "Add product", href: "/admin/products/new" }],
  },
  {
    title: "Orders",
    desc: "View orders and order items",
    href: "/admin/orders",
    cta: "View Orders",
    quick: [],
  },
  {
    title: "Categories",
    desc: "Manage product categories",
    href: "/admin/categories",
    cta: "Manage Categories",
    quick: [{ label: "Add category", href: "/admin/categories/new" }],
  },
  {
    title: "Pages",
    desc: "Edit site pages / content",
    href: "/admin/pages",
    cta: "Manage Pages",
    quick: [],
  },
  {
    title: "Site Editor",
    desc: "Visual editor / site settings",
    href: "/admin/site-editor",
    cta: "Open Site Editor",
    quick: [],
  },
  {
    title: "Users",
    desc: "Admin users list",
    href: "/admin/users",
    cta: "View Users",
    quick: [],
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="opacity-80">Quick access to manage your store.</p>
        </div>

        <div className="flex gap-2">
          <Link className="btn" href="/admin/products/new">
            + Add Product
          </Link>
          <Link className="btn" href="/admin/categories/new">
            + Add Category
          </Link>
        </div>
      </div>

      {/* “Tabs” style quick nav */}
      <div className="flex flex-wrap gap-2">
        <Link className="btn" href="/admin/products">Products</Link>
        <Link className="btn" href="/admin/orders">Orders</Link>
        <Link className="btn" href="/admin/categories">Categories</Link>
        <Link className="btn" href="/admin/pages">Pages</Link>
        <Link className="btn" href="/admin/site-editor">Site Editor</Link>
        <Link className="btn" href="/admin/users">Users</Link>
      </div>

      {/* Tiles */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.title} className="card p-4 space-y-3">
            <div>
              <div className="text-lg font-semibold">{t.title}</div>
              <div className="opacity-80">{t.desc}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link className="btn" href={t.href}>
                {t.cta}
              </Link>
              {t.quick.map((q) => (
                <Link key={q.href} className="btn" href={q.href}>
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

