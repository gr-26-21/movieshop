import AdminSidebar from "@/app/admin/_components/admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1">
        <header className="mb-8 flex items-center justify-between border-b px-3 py-4">
          <SidebarTrigger />
          <span>logged in as {session?.user?.role}</span>
        </header>

        <div className="p-5">{children}</div>
      </main>
    </SidebarProvider>
  );
}
