"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserRoleSelectProps {
  userId: string;
  role: "READER" | "AUTHOR";
}

export function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
  const [value, setValue] = useState(role);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleChange(nextRole: "READER" | "AUTHOR") {
    setValue(nextRole);
    setIsSaving(true);

    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: nextRole }),
    });

    setIsSaving(false);

    if (!response.ok) {
      setValue(role);
      return;
    }

    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={isSaving}
      onChange={(event) => handleChange(event.target.value as "READER" | "AUTHOR")}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
    >
      <option value="READER">Reader</option>
      <option value="AUTHOR">Author</option>
    </select>
  );
}
