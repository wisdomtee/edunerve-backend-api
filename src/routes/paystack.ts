import express from "express";
import crypto from "crypto";
import prisma from "../prisma";

const router = express.Router();

/* ===============================
   PAYSTACK WEBHOOK
================================ */

router.post("/webhook", async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY as string;

    const event = req.body;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(event))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    if (event.event === "charge.success") {
      const data = event.data;

      await prisma.payment.create({
        data: {
          schoolId: data.metadata.schoolId,
          amount: data.amount / 100,
          reference: data.reference,
          status: "SUCCESS",
        },
      });

      await prisma.subscription.upsert({
        where: {
          schoolId: data.metadata.schoolId,
        },
        update: {
          status: "ACTIVE",
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
        create: {
          schoolId: data.metadata.schoolId,
          plan: "PRO",
          status: "ACTIVE",
          amount: data.amount / 100,
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });

      console.log("Payment saved & subscription activated");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;