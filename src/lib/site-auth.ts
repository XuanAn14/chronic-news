import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "./prisma";

export const SITE_SESSION_COOKIE_NAME = "chronicle_site_session";

export function hashSitePassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function createSiteUser(input: {
  email: string;
  password: string;
  name: string;
  role?: "READER" | "AUTHOR";
}) {
  return prisma.siteUser.create({
    data: {
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      passwordHash: hashSitePassword(input.password),
      role: input.role ?? "READER",
    },
  });
}

export async function getAuthorFromCookie() {
  const user = await getSiteUserFromCookie();

  if (!user || user.role !== "AUTHOR") {
    return null;
  }

  return user;
}

export async function verifySiteCredentials(email: string, password: string) {
  const user = await prisma.siteUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    return null;
  }

  if (user.passwordHash !== hashSitePassword(password)) {
    return null;
  }

  return user;
}

export async function createSiteSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.siteSession.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function getSiteUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SITE_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.siteSession.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  return session?.user ?? null;
}

export function setSiteSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SITE_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSiteSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SITE_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
