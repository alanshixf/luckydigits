import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
  // .$extends({
  //   query: {
  //     cart: {
  //       async update({ args, query }) {
  //         args.data = { ...args.data, updatedAt: new Date() };
  //         return query(args);
  //       },
  //     },
  //   },
  // });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
