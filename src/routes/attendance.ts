import { Router } from "express"
import { prisma } from "../prisma"
import { Parser } from "json2csv"
import { authMiddleware } from "../middleware/auth"

const router = Router()

// Get attendance by date
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ message: "Date is required" })
    }

    const selectedDate = new Date(date as string)

    const attendance = await prisma.attendance.findMany({
      where: {
        date: selectedDate,
      },
      include: {
        student: {
          include: {
            school: true,
            classItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(attendance)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch attendance" })
  }
})

// Mark or update attendance
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    const { studentId, date, status } = req.body

    if (!studentId || !date || !status) {
      return res.status(400).json({ message: "studentId, date and status are required" })
    }

    const selectedDate = new Date(date)

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: selectedDate,
      },
    })

    if (existing) {
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status },
      })

      return res.json(updated)
    }

    const created = await prisma.attendance.create({
      data: {
        studentId,
        date: selectedDate,
        status,
      },
    })

    res.json(created)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to mark attendance" })
  }
})

export default router