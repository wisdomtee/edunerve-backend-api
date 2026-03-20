import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { protect, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/* ====================================
   REGISTER (Creates School + Admin)
==================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, schoolName } = req.body;

    if (!name || !email || !password || !schoolName) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create school
    const school = await prisma.school.create({
      data: {
        name: schoolName,
      },
    });

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        schoolId: school.id,
        subscriptionActive: true, // trial mode
      },
    });

    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
});

/* ====================================
   LOGIN
==================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});

/* ====================================
   GET CURRENT USER
==================================== */
router.get("/me", protect, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        school: true,
      },
    });

    res.json(user);
  } catch {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
});

export default router;