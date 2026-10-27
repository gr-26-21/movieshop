import { SignOutButton } from "@/components/sign-out-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Film, House, ShieldUser, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="mb-8 flex flex-row items-center justify-center gap-2 border-b py-3">
            <ShieldUser />
            <span className="white text-2xl">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* admin dashboard */}
          <SidebarMenuButton render={<Link href="/admin" />} className="px-5">
            <div className="flex items-center gap-3">
              <House />
              <span className="text-xl">Dashboard</span>
            </div>
          </SidebarMenuButton>
          {/* users */}
          <SidebarMenuButton
            render={<Link href="/admin/users" />}
            className="px-5"
          >
            <div className="flex items-center gap-3">
              <Users />
              <span className="text-xl">Users</span>
            </div>
          </SidebarMenuButton>
          {/* movies */}
          <SidebarMenuButton
            render={<Link href="/admin/movies" />}
            className="px-5"
          >
            <div className="flex items-center gap-3">
              <Film />
              <span className="text-xl">Movies</span>
            </div>
          </SidebarMenuButton>
          {/* orders */}
          <SidebarMenuButton
            render={<Link href="/admin/orders" />}
            className="px-5"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart />
              <span className="text-xl">Orders</span>
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
