import { NextResponse } from "next/server";
import { getCollection, saveCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  blocked?: boolean;
  createdAt: string;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as { blocked?: boolean };

  const users = await getCollection<UserRecord>("users");
  const user = users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ message: "Customer not found", status: 404 }, { status: 404 });
  }

  if (body.blocked !== undefined) {
    user.blocked = body.blocked;
    await saveCollection("users", users);
  }

  return NextResponse.json({ data: user });
}
