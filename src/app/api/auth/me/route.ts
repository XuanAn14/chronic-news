import { NextResponse } from "next/server";
import { getSiteUserFromCookie } from "../../../../lib/site-auth";

export async function GET() {
  const user = await getSiteUserFromCookie();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
}
