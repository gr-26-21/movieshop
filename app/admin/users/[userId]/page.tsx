import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { CalendarDays, Edit, Mail, User } from "lucide-react";
import Link from "next/link";
import SoftDeleteUserButton from "./_components/delete-user-button";
import RestoreUserButton from "./_components/restore-user-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// A page component for displaying user details in the admin dashboard
export default async function UserDetailsPage(
  props: PageProps<"/admin/users/[userId]">
) {
  // Controll logged in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Not logged in
  if (!session) {
    redirect("/login");
  }

  // Controll admin role
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  const { userId } = await props.params;

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      banned: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: userId,
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">User Details</h1>
        </div>

        <div className="flex max-w-6xl rounded-2xl border p-8">
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-3">
              <p className="mb-2 text-3xl">{user.name}</p>
              <Badge
                className={`px-4 py-3 ${
                  user.banned ? "bg-red-800" : "bg-green-800"
                }`}
              >
                {user.banned ? "banned" : "active"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={20} />
              <p>{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <User size={20} />
              <p>{user.role}</p>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={20} />
              <p>Joined on {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col justify-start gap-2 rounded-2xl">
            <RestoreUserButton userId={user.id} />
            <SoftDeleteUserButton userId={user.id} />
          </div>
        </div>

        <div className="space-y-1 rounded-2xl border p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl">Account Information</h2>
            <Link href={`/admin/users/${user.id}/update`}>
              <Badge className="flex cursor-pointer gap-1 px-4 py-4">
                <Edit /> <span>Edit</span>
              </Badge>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <span>Name</span>
            <span>{user.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Email Verified</span>
            <span>{user.emailVerified ? "verified" : "unverified"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Role</span>
            <span>{user.role}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Status</span>
            <span>{user.banned ? "banned" : "active"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Joined At</span>
            <span>{user.createdAt.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Last Updated</span>
            <span>{user.updatedAt.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>User ID</span>
            <span>{user.id}</span>
          </div>
        </div>
      </div>
    </>
  );
}
