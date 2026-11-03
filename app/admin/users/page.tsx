import UsersTable from "./_components/users-table";
import UsersSearchForm from "./_components/users-search-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const { search } = await searchParams;

  const result = await auth.api.listUsers({
    query: {
      searchValue: search,
      searchField: "name",
      searchOperator: "contains",
      sortBy: "createdAt",
      sortDirection: "desc",
    },

    headers: await headers(),
  });

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">USERS</h1>
          <div className="flex gap-2">
            <UsersSearchForm search={search} />
          </div>
        </div>
        <div className="rounded-2xl border p-5">
          <UsersTable users={result.users} />
        </div>
      </div>
    </>
  );
}
