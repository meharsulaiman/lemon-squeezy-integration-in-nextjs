// app/api/auth/login/route.js
import { login } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const { token, user } = await login(email, password);

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
