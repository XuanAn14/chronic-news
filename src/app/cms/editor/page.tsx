import { redirect } from "next/navigation";

export default function CMSEditorRedirect() {
  redirect("/admin/editor");
}
