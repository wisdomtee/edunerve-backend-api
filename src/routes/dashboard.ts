import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

router.get("/stats", authMiddleware, async (_req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const totalStudents = await prisma.student.count()

    const presentToday = await prisma.attendance.count({
      where: {
        status: "Present",
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    const absentToday = await prisma.attendance.count({
      where: {
        status: "Absent",
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    const lateToday = await prisma.attendance.count({
      where: {
        status: "Late",
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    res.json({
      totalStudents,
      presentToday,
      absentToday,
      lateToday,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch dashboard stats" })
  }
})

router.get("/attendance-week", authMiddleware, async (_req, res) => {
  try {
    const today = new Date()
    const days: { date: string; present: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDay = new Date(date)
      nextDay.setDate(date.getDate() + 1)

      const count = await prisma.attendance.count({
        where: {
          status: "Present",
          date: {
            gte: date,
            lt: nextDay,
          },
        },
      })

      days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        present: count,
      })
    }

    res.json(days)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch weekly attendance" })
  }
})

export default router