import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { log } from "node:console";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Forma antiga de usar o Prisma Client
//const prisma = new PrismaClient();

export { prisma };

export async function connection() {
  try {
    await prisma.$connect();
    log("Conectado ao banco de dados");
  } catch (error) {
    log(error);
  }
}
