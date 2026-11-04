import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UpdateUserForm from "./_components/update-user";

export default async function UpdateUserPage(
  props: PageProps<"/admin/users/[userId]">
) {
  // props
  const { userId } = await props.params;

  //   session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  //   get user data
  const user = await auth.api.getUser({
    query: {
      id: userId,
    },
    headers: await headers(),
  });

  return <UpdateUserForm user={user} />;
}
