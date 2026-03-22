const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkSchema() {
  try {
    const res = await client.execute("PRAGMA table_info(Product)");
    console.log("Product columns:", res.rows.map(r => r.name));
    
    const res2 = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='SiteContent'");
    console.log("SiteContent table exists:", res2.rows.length > 0);
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
}

checkSchema();
