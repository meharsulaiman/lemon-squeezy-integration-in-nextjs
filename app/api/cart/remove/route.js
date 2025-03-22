// app/api/cart/remove/route.js
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
    const { itemId } = await request.json();

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
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
