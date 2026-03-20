import { Router } from "express";
import prisma from "../prisma";
import { protect, AuthRequest } from "../middleware/auth.middleware";
import { subscriptionGuard } from "../middleware/subscription.middleware";

const router = Router();

/* ====================================
   DASHBOARD METRICS
==================================== */
router.get(
  "/metrics",
  protect,
  subscriptionGuard,
  async (req: AuthRequest, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user!.userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const schoolId = user.schoolId;

      const [studentCount, userCount] = await Promise.all([
        prisma.student.count({
          where: { schoolId },
        }),

        prisma.user.count({
          where: { schoolId },
        }),
      ]);

      res.json({
        students: studentCount,
        users: userCount,
      });
    } catch {
      res.status(500).json({
        message: "Failed to load metrics",
      });
    }
  }
);

export default router;