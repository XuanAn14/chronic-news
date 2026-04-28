import { redirect } from "next/navigation";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminLoginForm } from "../../../components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const admin = await getAdminFromCookie();
  if (admin) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginForm />;
}
