import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      database: "connected",
      service: "FaultMart API",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: "failed",
      error,
    });
  }
});

export default router;