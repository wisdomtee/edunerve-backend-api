import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (_req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        school: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(teachers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch teachers" })
  }
})

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, subject, schoolId } = req.body

    if (!name || !subject || !schoolId) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        subject,
        schoolId,
      },
    })

    res.json(teacher)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create teacher" })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, subject, schoolId } = req.body

    if (!name || !subject || !schoolId) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        name,
        subject,
        schoolId,
      },
    })

    res.json(teacher)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update teacher" })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.teacher.delete({
      where: { id },
    })

    res.json({ message: "Teacher deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete teacher" })
  }
})

export default router