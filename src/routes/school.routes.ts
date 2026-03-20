import express from "express"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/add", async (req, res) => {
  try {
    const { name, schoolId } = req.body

    const school = await prisma.school.create({
      data: {
        name,
        schoolId
      }
    })

    res.json(school)

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error })
  }
})

export default router