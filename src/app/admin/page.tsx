import { redirect } from "next/navigation";
import { getAdminFromCookie } from "../../lib/auth";

export default async function AdminRootPage() {
  const admin = await getAdminFromCookie();
  redirect(admin ? "/admin/dashboard" : "/admin/login");
}
