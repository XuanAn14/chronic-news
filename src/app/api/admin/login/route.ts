import { NextResponse } from "next/server";
import { createAdminSession, setAdminSessionCookie, verifyAdminCredentials } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return NextResponse.json(
      { error: "Invalid admin credentials." },
      { status: 401 },
    );
  }

  const token = await createAdminSession(admin.id);
  const response = NextResponse.json({ success: true });
  setAdminSessionCookie(response, token);
  return response;
}
