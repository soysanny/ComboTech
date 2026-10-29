import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { AuthUser } from "@/redux/slices/authSlice";

interface UserRecord extends AuthUser {
  passwordHash: string;
  blocked?: boolean;
  createdAt: string;
}

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const users = await getCollection<UserRecord>("users");
  const user = users.find((u) => u.id === auth.userId);
  if (!user) return unauthorized();

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
}
