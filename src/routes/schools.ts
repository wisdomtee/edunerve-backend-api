import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (_req, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        students: true,
        teachers: true,
        classes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(schools)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch schools" })
  }
})

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, address } = req.body

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" })
    }

    const school = await prisma.school.create({
      data: {
        name,
        address,
      },
    })

    res.json(school)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create school" })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, address } = req.body

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" })
    }

    const school = await prisma.school.update({
      where: { id },
      data: {
        name,
        address,
      },
    })

    res.json(school)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update school" })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.school.delete({
      where: { id },
    })

    res.json({ message: "School deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete school" })
  }
})

export default router