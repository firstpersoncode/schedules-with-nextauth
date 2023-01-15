import { PrismaClient } from "@prisma/client";

const db = globalThis.db || new PrismaClient();
if (!["production", "prod"].includes(process.env.NODE_ENV)) globalThis.db = db;

export default db;
