import { redirect } from "next/navigation";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminEditorForm } from "../../../components/admin/AdminEditorForm";
import { getCategoryOptions } from "../../../lib/categories";

export default async function AdminEditorPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await getCategoryOptions();

  return <AdminEditorForm categories={categories} />;
}
