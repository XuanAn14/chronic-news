import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  createSiteSession,
  createSiteUser,
  setSiteSessionCookie,
} from "../../../../lib/site-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  try {
    const user = await createSiteUser({ name, email, password });
    const token = await createSiteSession(user.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    setSiteSessionCookie(response, token);
    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 409 },
      );
    }

    throw error;
  }
}
