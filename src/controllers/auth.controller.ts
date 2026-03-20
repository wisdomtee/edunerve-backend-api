import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    const { password: _, ...safeUser } = user;

    return res.status(201).json({
      user: safeUser,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
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

    const token = generateToken(user);

    const { password: _, ...safeUser } = user;

    return res.json({
      user: safeUser,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
};