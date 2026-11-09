import UsersTable from "./_components/users-table";
import UsersSearchForm from "./_components/users-search-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { search } = await searchParams;

  // Only admins can list all users
const roles =
  session.user.role
    ?.split(",")
    .map((role) => role.trim()) ?? [];

if (!roles.includes("admin")) {
  redirect("/");
}

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
  // const result will get the user from from better auth

  return (
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
  );
}

// session will controll if user is logged in
// If user is not logged in or the session is missing, it will redirect to /login
// therefore guests wont reach users page
// optional chaining will controll if the user have a (includes) admin role
