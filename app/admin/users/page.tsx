import UsersTable from "../_components/users-table";

export default async function UsersPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl space-y-8">
        <h1 className="text-2xl">USERS</h1>
        <div className="rounded-2xl border p-5">
          <UsersTable />
        </div>
      </div>
    </>
  );
}
