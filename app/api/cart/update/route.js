// app/api/cart/update/route.js
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request) {
  const user = await getUser();

  if (!user) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { itemId, quantity } = await request.json();

    if (quantity < 1) {
      return Response.json(
        { success: false, error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Update the cart item
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    // Get the updated cart
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return Response.json({ success: true, cart });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
