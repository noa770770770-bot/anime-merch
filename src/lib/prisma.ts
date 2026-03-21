import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makePrisma() {
  const url = process.env["TURSO_DATABASE_URL"] || process.env["DATABASE_URL"] || "libsql://anime-merch-noa770770770-bot.aws-eu-west-1.turso.io";

  // Inject a dummy URL into Node.js so Prisma's strict
  // runtime validation engine doesn't crash on Netlify
  if (!process.env["DATABASE_URL"] || process.env["DATABASE_URL"] === "undefined") {
    process.env["DATABASE_URL"] = "file:./dev.db";
  }

  const authToken = process.env["TURSO_AUTH_TOKEN"] || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQxMzExODcsImlkIjoiMDE5ZDEyNzItNTkwMS03NDU4LWIzMmYtMzQzMTgxNWU0OGZjIiwicmlkIjoiNGVmOTNhNDEtN2M5MC00ZTFmLWEwNDYtN2E5MjNkMzQ5N2YwIn0.gEKrg3fOGrbEJoOH_CKQFaZKZ-gMsURpMCzhIrk5hDyZShB860CEtRtz9avR7nQtfNiuHhnhDxHPdK5A2ElqCA";

  // In Prisma 7+, PrismaLibSql now acts as an AdapterFactory requiring the raw Config object. 
  // Passing an instantiated @libsql/client object is no longer allowed and results in an internal 'undefined' URL crash.
  const adapter = new PrismaLibSql({ url, authToken });
  
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
