//  Prisma client
import { PrismaClient } from "../../generated/prisma/client.js";

export const USER_ROLES = ["admin", "user"] as const;

const prisma = new PrismaClient();
export default prisma;
