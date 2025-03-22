// components/Navbar.jsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MinimalShop
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-gray-300">
            Cart
          </Link>
          {user ? (
            <>
              <span>Hello, {user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
