import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { SESSION_COOKIE_NAME, clearAdminSessionCookie } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    await prisma.adminSession.deleteMany({ where: { token: sessionToken } });
  }

  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
