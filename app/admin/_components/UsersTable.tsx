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
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="rounded-2xl border p-5">
        <Table>
          <TableCaption>A list of your users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
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
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* edit button*/}
                    <Link
                      href="#"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "lg",
                      })}
                    >
                      Edit
                    </Link>
                    {/* delete button */}
                    <Link
                      href="#"
                      className={buttonVariants({
                        variant: "default",
                        size: "lg",
                      })}
                    >
                      Delete
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
