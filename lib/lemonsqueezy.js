// lib/lemonsqueezy.js
import axios from "axios";

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
const LEMON_SQUEEZY_VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID;

export async function createCheckout(order) {
  try {
    const response = await axios.post(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        data: {
          type: "checkouts",
          attributes: {
            custom_price: Math.round(order.total * 100), // in cents
            checkout_data: {
              email: order.user.email,
              name: order.user.name,
              custom: {
                order_id: order.id,
              },
            },
            product_options: {
              name: `Order #${order.id}`,
              description: `Contains ${order.items.length} item(s)`,
              redirect_url: `${process.env.NEXT_PUBLIC_URL}/thank-you?order_id=${order.id}`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: LEMON_SQUEEZY_VARIANT_ID,
              },
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        },
      }
    );
    console.log("🚀 ~ createCheckout ~ response:", response);

    const checkoutUrl = response.data.data.attributes.url;
    const checkoutId = response.data.data.id;

    return { checkoutUrl, checkoutId };
  } catch (error) {
    console.error("Checkout creation failed.");

    // Check if the error is from Axios and includes a response
    if (error.response) {
      console.error("Status:", error.response.status); // e.g., 422
      console.error("Headers:", error.response.headers);
      console.error("Data:", JSON.stringify(error.response.data, null, 2)); // most important
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    // Optional: log full config
    console.error("Axios config:", error.config);
  }
}
