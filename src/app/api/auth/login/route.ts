import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import type { AuthUser } from "@/redux/slices/authSlice";

interface UserRecord extends AuthUser {
  passwordHash: string;
  blocked?: boolean;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required", status: 400 }, { status: 400 });
    }

    const users = getCollection<UserRecord>("users");
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password", status: 401 }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ message: "Invalid email or password", status: 401 }, { status: 401 });
    }

    if (user.blocked) {
      return NextResponse.json({ message: "Account has been blocked", status: 403 }, { status: 403 });
    }

    // Storefront has no customer accounts — only staff portals can sign in.
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "This account is not permitted to sign in.", status: 403 },
        { status: 403 },
      );
    }

    const token = signToken(user.id, user.role);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
    });

    const secure = process.env.NODE_ENV === "production";
    const sessionCookie = JSON.stringify({ role: user.role });
    response.cookies.set("svc_session", sessionCookie, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: true,
      secure,
    });
    response.cookies.set("token", token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "lax",
      httpOnly: true,
      secure,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Authentication failed. Please try again.", status: 500 },
      { status: 500 },
    );
  }
}
