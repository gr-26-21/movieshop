import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserCounter() {
  const users = await auth.api.listUsers({
    query: {
      sortBy: "name", // The field to sort by.
    },

    headers: await headers(),
  });

  return users.total;
}
