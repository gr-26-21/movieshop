import AdminSidebar from "@/app/admin/_components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth-helpers";

//
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1">
        <header className="mb-8 flex items-center justify-between border-b px-3 py-4">
          <SidebarTrigger />
          <span className="pr-8">logged in as {session?.user?.role}</span>
        </header>

        <div className="p-5">{children}</div>
      </main>
    </SidebarProvider>
  );
}
