// app/thank-you/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ThankYou() {
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    async function fetchOrder() {
      if (!orderId) return;

      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto py-8">
        <div className="bg-green-100 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <svg
              className="h-16 w-16 text-green-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-green-700 mb-6">
              Your order has been successfully placed.
            </p>

            {order && (
              <div className="text-left bg-white text-gray-900 p-4 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                <p className="mb-1">
                  <span className="font-medium">Order ID:</span> {order.id}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Total:</span> $
                  {order.total.toFixed(2)}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Status:</span> {order.status}
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Items:</h3>
                  <ul className="list-disc pl-5">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} x {item.quantity} - $
                        {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
