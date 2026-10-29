import { NextResponse } from "next/server";
import { getCollection, paginate } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { ActivityLog } from "@/features/admin/types";

export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  const logs = await getCollection<ActivityLog>("logs");
  return NextResponse.json(paginate(logs, page, pageSize));
}
