import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { isStaffRole } from "@/lib/admin/staff";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?redirect=/admin");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!isStaffRole(profile?.role)) {
    redirect("/dashboard");
  }

  return (
    <AdminShell userEmail={user.email ?? null} staffRole={profile?.role ?? null}>
      {children}
    </AdminShell>
  );
}
