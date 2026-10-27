import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { CalendarDays, Mail, User } from "lucide-react";

export default async function UserDetailsPage(
  props: PageProps<"/admin/users/[userId]">
) {
  const { userId } = await props.params;

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
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
      <div className="mx-auto max-w-6xl space-y-10">
        <h1 className="text-4xl">User Details</h1>
        <div className="max-w-6xl rounded-2xl border p-8">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <p className="mb-2 text-3xl">{user.name}</p>
              <Badge className="bg-green-800 px-4 py-3">
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
      </div>
    </>
  );
}
