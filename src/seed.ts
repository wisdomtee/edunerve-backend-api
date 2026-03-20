import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@educore.com"
  const plainPassword = "admin123"
  const hashedPassword = await bcrypt.hash(plainPassword, 10)

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
      password: hashedPassword,
    },
  })

  console.log("Admin created successfully")
  console.log("Email:", email)
  console.log("Password:", plainPassword)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })