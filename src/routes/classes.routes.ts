import { Router } from "express"
import { prisma } from "../prisma"

const router = Router()

// GET all classes
router.get("/", async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        school: true,
      },
    })

    res.json(classes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch classes" })
  }
})


// CREATE class
router.post("/create", async (req, res) => {
  try {
    const { name, schoolId } = req.body

    const newClass = await prisma.class.create({
      data: {
        name,
        schoolId,
      },
    })

    res.json(newClass)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create class" })
  }
})


// UPDATE class
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, schoolId } = req.body

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        schoolId,
      },
    })

    res.json(updatedClass)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to update class" })
  }
})


// DELETE class
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.class.delete({
      where: { id },
    })

    res.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to delete class" })
  }
})

export default router