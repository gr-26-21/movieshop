import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { CalendarDays, Edit, Mail, User } from "lucide-react";
import Link from "next/link";

export default async function UserDetailsPage(
  props: PageProps<"/admin/users/[userId]">
) {
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
      {/* basic info */}
      <div className="mx-auto max-w-6xl space-y-10">
        <h1 className="text-4xl">User Details</h1>
        <div className="max-w-6xl rounded-2xl border p-8">
          <div className="space-y-0.5">
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
        </div>

        {/* detail user info */}
        <div className="space-y-1 rounded-2xl border p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl">Account Information</h2>
            <Link href={`/admin/users/${user.id}/update`}>
              <Badge className="flex cursor-pointer gap-1 px-4 py-4">
                <Edit /> <span>Edit</span>
              </Badge>
            </Link>
          </div>
          {/* name */}
          <div className="flex items-center justify-between">
            <span>Name</span>
            <span>{user.name}</span>
          </div>
          {/* email */}
          <div className="flex items-center justify-between">
            <span>Email</span>
            <span>{user.email}</span>
          </div>
          {/* email verified */}
          <div className="flex items-center justify-between">
            <span>Email Verified</span>
            <span>{user.emailVerified}</span>
          </div>
          {/* role */}
          <div className="flex items-center justify-between">
            <span>Role</span>
            <span>{user.role}</span>
          </div>
          {/* status */}
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span> {user.banned ? "banned" : "active"}</span>
          </div>
          {/* joined at */}
          <div className="flex items-center justify-between">
            <span>Joined At</span>
            <span>{user.createdAt.toLocaleDateString()}</span>
          </div>
          {/* updated at */}
          <div className="flex items-center justify-between">
            <span>Last Updated</span>
            <span>{user.updatedAt.toLocaleDateString()}</span>
          </div>
          {/* user id */}
          <div className="flex items-center justify-between">
            <span>User ID</span>
            <span>{user.id}</span>
          </div>
        </div>
      </div>
    </>
  );
}
