import { NextResponse } from "next/server";
import { getCollection, paginate } from "@/lib/db";
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

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const users = getCollection<UserRecord>("users");
  const customers = users.filter((u) => u.role === "user");
  return NextResponse.json(paginate(customers, page, pageSize));
}
