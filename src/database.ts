import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connect = (): Promise<void> => prisma.$connect();

export const close = (): Promise<void> => prisma.$disconnect();
