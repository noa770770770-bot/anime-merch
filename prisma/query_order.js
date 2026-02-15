process.env.DATABASE_URL = 'file:./prisma/dev.db';
const {PrismaClient}=require('@prisma/client');
const {PrismaBetterSqlite3}=require('@prisma/adapter-better-sqlite3');
const prisma=new PrismaClient({adapter:new PrismaBetterSqlite3({url:process.env.DATABASE_URL})});
(async()=>{
  const oid = process.env.OID || '';
  const o=await prisma.order.findUnique({where:{id:oid}, include:{items:true}});
  console.log(JSON.stringify(o,null,2));
  await prisma.$disconnect();
})();
