process.env.DATABASE_URL = 'file:./prisma/dev.db';
const fetch = require('node-fetch');
(async()=>{
  const PROD = 'cmlmm5we10000d0w1wpmtrum9';
  const VAR = 'cmlmqisdo000098w1880fn3me';
  const body = { items:[{ productId: PROD, variantId: VAR, qty:1 }], email:'test@test.com', shippingName:'Test', shippingPhone:'0500000000', shippingAddress1:'Test 1', shippingAddress2:'', shippingCity:'TestCity', shippingZip:'00000', shippingCountry:'IL' };
  const res = await fetch('http://localhost:3000/api/orders/create', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  console.log(JSON.stringify(data,null,2));
})();
