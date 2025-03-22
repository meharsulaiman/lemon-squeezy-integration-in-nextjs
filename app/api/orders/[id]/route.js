// app/api/orders/[id]/route.js
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const user = await getUser();

  if (!user) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
