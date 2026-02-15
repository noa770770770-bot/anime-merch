import pkg from '../src/lib/prisma';
const prisma = (pkg as any).default || (pkg as any).prisma;

async function main(){
  await prisma.product.createMany({ data: [
    { name: "Neko Hoodie", slug: "neko-hoodie", priceILS: 149, description: "Soft hoodie with neko ears", imageUrl: null },
    { name: "Sailor Socks", slug: "sailor-socks", priceILS: 29, description: "Kawaii socks", imageUrl: null }
  ] });
  console.log('seed complete');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
