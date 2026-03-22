import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminProducts() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Products Test Page</h1>
      <p>If you see this, the layout and routing are working.</p>
      <Link href="/admin" className="text-accent underline">Back to Dashboard</Link>
    </div>
  );
}
