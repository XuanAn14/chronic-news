import { redirect } from "next/navigation";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminEditorForm } from "../../../components/admin/AdminEditorForm";

export default async function AdminEditorPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminEditorForm />;
}
