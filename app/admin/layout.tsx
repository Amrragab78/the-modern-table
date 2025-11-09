import { supabaseAdmin } from "@/lib/supabase";
import AdminSidebarLayout from "./AdminSidebarLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get admin session for header
  let adminEmail = "Admin User";
  
  return (
    <AdminSidebarLayout adminEmail={adminEmail}>
      {children}
    </AdminSidebarLayout>
  );
}
