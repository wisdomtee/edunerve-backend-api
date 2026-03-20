import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = Router()

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "", page = "1", limit = "10" } = req.query

    const pageNumber = parseInt(page as string)
    const pageSize = parseInt(limit as string)

    const students = await prisma.student.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            studentId: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        school: true,
        classItem: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.student.count({
      where: {
        OR: [
          {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            studentId: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        ],
      },
    })

    res.json({
      students,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch students" })
  }
})

router.post(
  "/create",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, studentId, classId, schoolId } = req.body

      if (!name || !studentId || !classId || !schoolId) {
        return res.status(400).json({ message: "All fields are required" })
      }

      const photo = req.file ? (req.file as any).path : null

      const student = await prisma.student.create({
        data: {
          name,
          studentId,
          classId,
          schoolId,
          photo,
        },
      })

      res.json(student)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Failed to create student" })
    }
  }
)

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        school: true,
        classItem: true,
        attendance: {
          orderBy: {
            date: "desc",
          },
        },
        results: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(student)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch student" })
  }
})

router.put(
  "/:id",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name, studentId, classId, schoolId } = req.body

      if (!name || !studentId || !classId || !schoolId) {
        return res.status(400).json({ message: "All fields are required" })
      }

      const existingStudent = await prisma.student.findUnique({
        where: { id },
      })

      const photo = req.file
  ? (req.file as any).path
  : existingStudent?.photo || null

      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          name,
          studentId,
          classId,
          schoolId,
          photo,
        },
      })

      res.json(updatedStudent)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Failed to update student" })
    }
  }
)

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.student.delete({
      where: { id },
    })

    res.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete student" })
  }
})

export default router