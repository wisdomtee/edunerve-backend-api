import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

/* ==========================================
   ROLE GUARD
========================================== */
export const requireRole = (role: string) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const prisma = (await import("../prisma")).default;

      const user = await prisma.user.findUnique({
        where: { id: req.user?.userId },
      });

      if (!user || user.role !== role) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};