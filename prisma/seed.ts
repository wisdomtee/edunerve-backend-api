import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@educore.com"
  const password = await bcrypt.hash("admin123", 10)

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log("Admin already exists")
    return
  }

  await prisma.admin.create({
    data: {
      name: "EduCore Admin",
      email,
      password,
    },
  })

  console.log("Admin created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })