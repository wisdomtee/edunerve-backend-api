import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});