
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UpdateUserForm from "./_components/update-user";

export default async function UpdateUserPage(
  props: PageProps<"/admin/users/[userId]/update">
) {
  // Controlls if the user has an active session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  // If no session -> "/login"

  // Control the admin role
  const roles =
    session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

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

// this page gets the user and shows the form which will lead to an update