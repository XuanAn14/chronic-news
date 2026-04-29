import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { getAdminFromCookie } from "../../../../../../lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const role = body?.role?.toString().trim();

  if (!["READER", "AUTHOR"].includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const user = await prisma.siteUser.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
