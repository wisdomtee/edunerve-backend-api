import { Request, Response } from "express";
import { onboardSchool } from "../services/onboarding.service";

export const registerSchool = async (req: Request, res: Response) => {
  try {
    const result = await onboardSchool(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: "School onboarding failed"
    });
  }
};