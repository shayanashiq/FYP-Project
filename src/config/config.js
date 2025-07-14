import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dbConnect = async () => {
  // Optionally you can add any custom logic before connecting
  try {
    await prisma.$connect();
  } catch (error) {
    throw error;
  }
  return prisma;
};

export default dbConnect;
