const { createClient } = require('@libsql/client');

async function repair() {
  const url = 'libsql://anime-merch-noa770770770-bot.aws-eu-west-1.turso.io';
  const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQxMzExODcsImlkIjoiMDE5ZDEyNzItNTkwMS03NDU4LWIzMmYtMzQzMTgxNWU0OGZjIiwicmlkIjoiNGVmOTNhNDEtN2M5MC00ZTFmLWEwNDYtN2E5MjNkMzQ5N2YwIn0.gEKrg3fOGrbEJoOH_CKQFaZKZ-gMsURpMCzhIrk5hDyZShB860CEtRtz9avR7nQtfNiuHhnhDxHPdK5A2ElqCA';

  const client = createClient({ url, authToken });

  console.log('Creating SiteContent table manually on Turso...');
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "SiteContent" (
        "key" TEXT NOT NULL PRIMARY KEY,
        "value" TEXT NOT NULL
      );
    `);
    console.log('Success! Table created.');
  } catch (e) {
    console.error('Error creating table:', e.message);
  } finally {
    client.close();
  }
}

repair();
