import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { User } from "lucide-react";
import Link from "next/link";

export default async function UsersTable() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader className="text-xl">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-row items-center gap-1">
                  <User />
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  className={`px-4 py-3 ${
                    user.banned ? "bg-red-800" : "bg-green-800"
                  }`}
                >
                  {user.banned ? "banned" : "active"}
                </Badge>
              </TableCell>
              <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {/* view button*/}
                  <Link
                    href={`/admin/users/${user.id}`}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "lg",
                    })}
                  >
                    View
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
