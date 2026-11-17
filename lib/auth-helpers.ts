import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { canAccessAdmin } from "./check-permissions";

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // user not logged in /login
  if (!session) {
    return { status: "unauthenticated" as const };
  }

  const isAdmin = await canAccessAdmin(session.user.id);

  // user is logged in but not an admin "/"
  if (!isAdmin) {
    return { status: "forbidden" as const };
  }
  // user has admin access
  return { status: "authorized" as const, session };
}

export async function requireAdmin() {
  const result = await getAdminSession();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }

  if (result.status === "forbidden") {
    redirect("/");
  }

  return result.session;
}

// Use requireAdmin() when you want to redirect unauthorized users away from a page.
// Use getAdminSession() when you want to decide what the server function should return when access is denied.
