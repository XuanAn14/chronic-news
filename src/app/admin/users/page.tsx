import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { getAdminFromCookie } from "../../../lib/auth";
import { AdminShell } from "../../../components/admin/AdminShell";
import { UserRoleSelect } from "../../../components/admin/UserRoleSelect";

export default async function AdminUsersPage() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    redirect("/admin/login");
  }

  const users = await prisma.siteUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const authorCount = users.filter((user) => user.role === "AUTHOR").length;

  const rightPanel = (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Registered users
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{users.length}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Authors
        </p>
        <p className="mt-2 text-3xl font-bold text-blue-700">{authorCount}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Promote a reader to <span className="font-semibold text-slate-900">Author</span> to
        give them access to the author studio, article publishing, and engagement metrics.
      </div>
    </div>
  );

  return (
    <AdminShell
      title="User Management"
      subtitle="Review registered readers and assign author permissions."
      rightPanel={rightPanel}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Articles
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <UserRoleSelect userId={user.id} role={user.role} />
                  </td>
                  <td className="p-4 text-sm text-slate-600">{user._count.articles}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
