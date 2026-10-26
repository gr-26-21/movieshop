import { SignOutButton } from "@/components/sign-out-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Film, ShieldUser, Users } from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="mb-8 flex flex-row items-center justify-center gap-2 border-b py-3">
            <ShieldUser />
            <span className="text-2xl">Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenuButton render={<Link href="/admin/users" />}>
            <div className="flex items-center gap-3">
              <Users />
              <span className="text-xl">Users</span>
            </div>
          </SidebarMenuButton>
          <SidebarMenuButton render={<Link href="#" />}>
            <div className="flex items-center gap-3">
              <Film />
              <span className="text-xl">Movies</span>
            </div>
          </SidebarMenuButton>
        </SidebarContent>
        <SidebarFooter>
          <SignOutButton />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
