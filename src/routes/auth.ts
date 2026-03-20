import { Router } from "express"
import bcrypt from "bcryptjs"
import { prisma } from "../prisma"
import { generateToken } from "../utils/generateToken"

const router = Router()

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" })
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Register failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: "admin",
    })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Login failed" })
  }
})

export default router