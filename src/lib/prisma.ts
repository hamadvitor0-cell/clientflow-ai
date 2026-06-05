import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  clientflowPrisma?: PrismaClient;
};

export function getPrisma() {
  if (!globalForPrisma.clientflowPrisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL nao configurada. Copie .env.example para .env e configure um PostgreSQL.");
    }

    globalForPrisma.clientflowPrisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  return globalForPrisma.clientflowPrisma;
}
