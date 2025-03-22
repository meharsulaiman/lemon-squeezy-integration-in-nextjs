import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

export async function POST(req) {
  const prisma = new PrismaClient();
  try {
    // Catch the event type
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const body = await req.json();

    // Check signature
    const secret = process.env.LEMON_SQUEEZY_SIGNING_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      hmac.update(await clonedReq.text()).digest("hex"),
      "utf8"
    );
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    // Logic according to event
    if (eventType === "order_created") {
      const orderId = body.meta.custom_data?.order_id;
      const isSuccessful = body.data.attributes.status === "paid";

      console.log("🚀 ~ POST ~ body:", body.meta);

      if (!orderId) {
        return Response.json(
          { error: "Missing order_id in custom_data" },
          { status: 400 }
        );
      }

      // First check if the order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder) {
        return Response.json(
          { error: `Order with ID ${orderId} not found in database` },
          { status: 404 }
        );
      }

      // Update order in DB
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      });

      return Response.json({ success: true });
    }

    return Response.json({
      success: false,
      message: `Unhandled event: ${eventType}`,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
