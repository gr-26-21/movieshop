import { requireAdmin } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UpdateUserForm from "./_components/update-user";

// A page component for updating user details in the admin dashboard
export default async function UpdateUserPage(
  props: PageProps<"/admin/users/[userId]/update">
) {
  await requireAdmin();

  // get userId
  const { userId } = await props.params;

  // get user information
  const user = await auth.api.getUser({
    query: {
      id: userId,
    },
    headers: await headers(),
  });

  if (!user) {
    redirect("/admin/users");
  }

  return <UpdateUserForm user={user} />;
}
