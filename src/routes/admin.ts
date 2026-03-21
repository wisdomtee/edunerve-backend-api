import { Router } from "express"
import { authMiddleware, AuthRequest } from "../middleware/auth"

const router = Router()

router.get("/dashboard", authMiddleware, (req: AuthRequest, res) => {
  return res.status(200).json({
    message: "Welcome to admin dashboard",
    user: req.user
  })
})

export default router