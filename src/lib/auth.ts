import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "./prisma";
import {
  hashPassword as createPasswordHash,
  needsPasswordRehash,
  verifyPassword,
} from "./password";

export const SESSION_COOKIE_NAME = "chronicle_admin_session";

export function hashPassword(password: string) {
  return createPasswordHash(password);
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return null;
  }

  if (!verifyPassword(password, admin.passwordHash)) {
    return null;
  }

  if (needsPasswordRehash(admin.passwordHash)) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(password) },
    });
  }

  return admin;
}

export async function createAdminSession(adminId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8);

  await prisma.adminSession.deleteMany({
    where: {
      adminId,
    },
  });

  await prisma.adminSession.create({
    data: {
      token,
      adminId,
      expiresAt,
    },
  });

  return token;
}

export async function getAdminFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: {
      token,
    },
    select: {
      expiresAt: true,
      admin: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session.admin;
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
