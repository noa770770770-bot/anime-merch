process.env.DATABASE_URL = 'file:./prisma/dev.db';
const {PrismaClient}=require('@prisma/client');
const {PrismaBetterSqlite3}=require('@prisma/adapter-better-sqlite3');
const prisma=new PrismaClient({adapter:new PrismaBetterSqlite3({url:process.env.DATABASE_URL})});
(async()=>{
  const p=await prisma.product.findFirst();
  if(!p) throw new Error('No product');
  const existing=await prisma.productVariant.findMany({where:{productId:p.id}});
  if(existing.length===0){
    await prisma.productVariant.createMany({data:[ {productId:p.id,name:'Size',value:'S',stock:10},{productId:p.id,name:'Size',value:'M',stock:10},{productId:p.id,name:'Size',value:'L',stock:10} ]});
  }
  const v=await prisma.productVariant.findFirst({where:{productId:p.id}});
  console.log('PRODUCT_ID='+p.id);
  console.log('SLUG='+p.slug);
  console.log('VARIANT_ID='+v.id);
  await prisma.$disconnect();
})();
