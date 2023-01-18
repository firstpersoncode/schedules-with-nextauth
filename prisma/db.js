import { PrismaClient } from "@prisma/client";

const db = globalThis.db || new PrismaClient();
if (!["production", "prod"].includes(process.env.NODE_ENV)) globalThis.db = db;

export default db;

export async function makeDBConnection(callback = async () => {}) {
  try {
    await db.$connect();
    const res = await callback(db);
    await db.$disconnect();
    return res;
  } catch (err) {
    await db.$disconnect();
    throw err;
  }
}
