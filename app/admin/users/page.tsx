import UsersTable from "./_components/users-table";
import UsersSearchForm from "./_components/users-search-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UsersPagination from "./_components/users-pagination";

//
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  // Check if user is in a active session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Admin access to list all users
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  const { search, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const pageSize = 10;

  const result = await auth.api.listUsers({
    query: {
      searchValue: search,
      searchField: "name",
      searchOperator: "contains",
      sortBy: "createdAt",
      sortDirection: "desc",

      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    },
    headers: await headers(),
  });

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col items-start justify-between space-y-5 sm:flex-row sm:items-center">
          <h1 className="text-2xl sm:text-3xl">USERS</h1>
          <div className="w-full sm:w-auto">
            <UsersSearchForm search={search} />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border p-5">
          <UsersTable users={result.users} />
        </div>

        {/* Pagination  */}
        <div>
          <UsersPagination
            currentPage={currentPage}
            totalPages={Math.ceil(result.total / pageSize)}
            search={search}
          />
        </div>
      </div>
    </>
  );
}
