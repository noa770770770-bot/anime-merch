import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p className="page-subtitle">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">+ Add Category</Link>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>No categories yet</h3>
          <p>Create your first category to organize products.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: any) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.slug}</td>
                  <td style={{ fontSize: 13 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
