const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

const products = [
  ['Neko Hoodie','neko-hoodie','Soft hoodie with neko ears and embroidered patch.',149,'/products/neko-hoodie.svg', JSON.stringify(['/products/neko-hoodie.svg'])],
  ['Chibi Keychain','chibi-keychain','Cute chibi character acrylic keychain.',29,'/products/chibi-keychain.svg', JSON.stringify(['/products/chibi-keychain.svg'])],
  ['Sailor Scarf','sailor-scarf','Lightweight scarf with sailor motif.',89,'/products/sailor-scarf.svg', JSON.stringify([])],
  ['Anime Poster A','anime-poster-a','Art print poster (A2) — limited run.',59,'/products/anime-poster-a.svg', JSON.stringify([])],
  ['Manga Enamel Pin','manga-enamel-pin','Hard enamel pin with rubber clutch.',39,'/products/manga-enamel-pin.svg', JSON.stringify([])],
  ['Senpai Tee','senpai-tee','100% cotton tee with front print.',99,'/products/senpai-tee.svg', JSON.stringify([])],
];

const insert = db.prepare(`INSERT INTO Product (name, slug, description, price_ils, image_url, images, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);

const existing = db.prepare('SELECT COUNT(*) as c FROM Product').get();
if (existing && existing.c > 0) {
  console.log('Products already exist, skipping insert.');
  process.exit(0);
}

const insertMany = db.transaction((rows) => {
  for (const r of rows) insert.run(r[0], r[1], r[2], r[3], r[4], r[5]);
});

try {
  insertMany(products);
  console.log('Inserted', products.length, 'products');
} catch (e) {
  console.error('Insert failed', e);
  process.exit(1);
}
