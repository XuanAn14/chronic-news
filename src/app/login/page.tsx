import { redirect } from "next/navigation";
import { AuthForm } from "../../components/auth/AuthForm";
import { getSiteUserFromCookie } from "../../lib/site-auth";

export default async function LoginPage() {
  const user = await getSiteUserFromCookie();

  if (user) {
    redirect(user.role === "AUTHOR" ? "/author" : "/settings");
  }

  return <AuthForm />;
}
