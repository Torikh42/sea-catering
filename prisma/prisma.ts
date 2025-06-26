// prisma/prisma.ts
import { PrismaClient } from "@prisma/client";

// Mencegah pembuatan instance Prisma Client baru di setiap hot reload development
// Ini adalah pattern umum untuk Next.js
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;