import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }
}
