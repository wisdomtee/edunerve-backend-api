import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/:studentId", authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params

    const results = await prisma.result.findMany({
      where: { studentId },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch results" })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { studentId, subject, score } = req.body

    if (!studentId || !subject || score === undefined) {
      return res.status(400).json({
        message: "studentId, subject and score are required",
      })
    }

    const result = await prisma.result.create({
      data: {
        studentId,
        subject,
        score: Number(score),
      },
    })

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create result" })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.result.delete({
      where: { id },
    })

    res.json({ message: "Result deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete result" })
  }
})

export default router