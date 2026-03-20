import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const schools = await prisma.school.findMany();
  console.log("Schools:", schools);
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());