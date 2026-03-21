import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const url = "libsql://anime-merch-noa770770770-bot.aws-eu-west-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQxMzExODcsImlkIjoiMDE5ZDEyNzItNTkwMS03NDU4LWIzMmYtMzQzMTgxNWU0OGZjIiwicmlkIjoiNGVmOTNhNDEtN2M5MC00ZTFmLWEwNDYtN2E5MjNkMzQ5N2YwIn0.gEKrg3fOGrbEJoOH_CKQFaZKZ-gMsURpMCzhIrk5hDyZShB860CEtRtz9avR7nQtfNiuHhnhDxHPdK5A2ElqCA";

const client = createClient({ url, authToken });

async function push() {
  const sql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf-8');
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    for (const row of res.rows) {
      if (row.name !== 'sqlite_sequence') {
        await client.execute(`DROP TABLE IF EXISTS "${row.name}"`);
      }
    }
    await client.executeMultiple(sql);
    console.log('Successfully pushed schema to Turso!');
  } catch (e) {
    console.error('Failed to execute SQL:', e.message);
  }
}
push();
