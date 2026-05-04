import { redirect } from "next/navigation";

export default function CMSDashboardRedirect() {
  redirect("/admin/dashboard");
}
