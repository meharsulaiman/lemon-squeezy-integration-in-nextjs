// app/api/checkout/route.js
import { PrismaClient } from "@prisma/client";
import { getUser } from "@/lib/auth";
import { createCheckout } from "@/lib/lemonsqueezy";

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
    // Get the user's cart
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

    if (!cart || cart.items.length === 0) {
      return Response.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate the total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create an order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Create a checkout with LemonSqueezy
    const { checkoutUrl, checkoutId } = await createCheckout(order);

    // Update the order with the payment info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: checkoutId,
        paymentUrl: checkoutUrl,
      },
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return Response.json({ success: true, checkoutUrl });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
