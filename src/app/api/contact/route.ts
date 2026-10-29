import { NextResponse } from "next/server";
import { createOne, getCollection } from "@/lib/db";
import { getAuth, unauthorized } from "@/lib/auth";
import type { ContactInput, ContactMessage } from "@/features/contact/types";

/** Public: submit a contact message (persisted to the database). */
export async function POST(request: Request) {
  let body: ContactInput;
  try {
    body = (await request.json()) as ContactInput;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body", status: 400 },
      { status: 400 },
    );
  }

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { message: "Name, email and message are required", status: 400 },
      { status: 400 },
    );
  }

  const message: ContactMessage = {
    ...body,
    id: `contact-${Date.now()}`,
    status: "received",
    createdAt: new Date().toISOString(),
  };

  await createOne("contactMessages", message);
  return NextResponse.json({ data: message }, { status: 201 });
}

/** Admin: list contact messages, newest first. */
export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth || auth.role !== "admin") return unauthorized();

  const messages = await getCollection<ContactMessage>("contactMessages");
  messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ data: messages });
}
