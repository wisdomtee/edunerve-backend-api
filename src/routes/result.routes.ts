import { Router } from "express"
import { prisma } from "../prisma"
import { authMiddleware } from "../middleware/auth"
import { generateVerificationCode } from "../utils/generateCode"

const router = Router()


// Upload Result
router.post("/upload", authMiddleware, async (req: any, res) => {

  try {

    const { studentId, subject, score, grade } = req.body

    if (!studentId || !subject || !score || !grade) {
      return res.status(400).json({
        message: "studentId, subject, score and grade are required"
      })
    }

    const verificationCode = generateVerificationCode()

    const result = await prisma.result.create({
      data: {
        studentId,
        subject,
        score,
        grade,
        verificationCode
      }
    })

    res.json({
      message: "Result uploaded successfully",
      result
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Internal server error"
    })
  }

})


// Verify Result (Public)
router.get("/verify/:code", async (req, res) => {

  try {

    const { code } = req.params

    const result = await prisma.result.findUnique({
      where: {
        verificationCode: code
      },
      include: {
        student: true
      }
    })

    if (!result) {
      return res.status(404).json({
        message: "Invalid verification code"
      })
    }

    res.json({
      student: result.student.name,
      subject: result.subject,
      score: result.score,
      grade: result.grade
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Internal server error"
    })
  }

})


export default router