import { Router } from "express"
import prisma from "../prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const search = String(req.query.search || "")
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              studentId: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}

    const students = await prisma.student.findMany({
      where,
      include: {
        school: {
          select: {
            name: true,
          },
        },
        classItem: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await prisma.student.count({ where })

    return res.status(200).json({
      students,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error("GET STUDENTS ERROR:", error)
    return res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    })
  }
})

export default router