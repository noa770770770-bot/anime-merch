const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main(){
  await prisma.product.createMany({ data: [
    { name: 'Neko Hoodie', slug: 'neko-hoodie', priceILS: 149, description: 'Soft hoodie with neko ears', imageUrl: null, active: true },
    { name: 'Sailor Socks', slug: 'sailor-socks', priceILS: 29, description: 'Kawaii socks', imageUrl: null, active: true }
  ] });
  console.log('seed complete');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
