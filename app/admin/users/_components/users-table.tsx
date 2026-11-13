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
import { User } from "lucide-react";
import Link from "next/link";

// A component for displaying a table of users
export default async function UsersTable({
  users,
}: {
  users: {
    id: string;
    name: string | null;
    email: string;
    role?: string;
    banned: boolean | null;
    createdAt: Date;
  }[];
}) {
  return (
    <>
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader className="text-xl">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Role</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
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
              <TableCell className="hidden sm:table-cell">
                {user.email}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.role}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge
                  className={`px-4 py-3 ${
                    user.banned ? "bg-red-800" : "bg-green-800"
                  }`}
                >
                  {user.banned ? "banned" : "active"}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.createdAt.toLocaleDateString()}
              </TableCell>
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
