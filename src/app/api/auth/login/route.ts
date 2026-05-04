import { NextResponse } from "next/server";
import {
  createSiteSession,
  setSiteSessionCookie,
  verifySiteCredentials,
} from "../../../../lib/site-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();
  const rateLimit = checkRateLimit({
    key: `site-login:${getClientIp(request)}:${email || "missing"}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfter);
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await verifySiteCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

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
}
