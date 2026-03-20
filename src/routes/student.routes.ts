import { Router } from "express"
import { prisma } from "../prisma"

const router = Router()

router.get("/", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" })
  }
})

router.post("/create", async (req, res) => {
  try {
    const { name, studentId, className, schoolId } = req.body

    const student = await prisma.student.create({
      data: {
        name,
        studentId,
        class: className,
        schoolId,
      },
    })

    res.json(student)
  } catch (error) {
    res.status(500).json({ message: "Failed to create student" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, studentId, className, schoolId } = req.body

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name,
        studentId,
        class: className,
        schoolId,
      },
    })

    res.json(updatedStudent)
  } catch (error) {
    res.status(500).json({ message: "Failed to update student" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.student.delete({
      where: { id },
    })

    res.json({ message: "Student deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student" })
  }
})

export default router