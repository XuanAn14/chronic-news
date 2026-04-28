import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import {
  SITE_SESSION_COOKIE_NAME,
  clearSiteSessionCookie,
} from "../../../../lib/site-auth";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SITE_SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.siteSession.deleteMany({
      where: { token: sessionToken },
    });
  }

  const response = NextResponse.json({ success: true });
  clearSiteSessionCookie(response);
  return response;
}
