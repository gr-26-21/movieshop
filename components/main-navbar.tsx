import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SignInForm } from "./auth/sign-in-form";
import { RegisterForm } from "./auth/register-form";
import { SignOutButton } from "./sign-out-button";

export default async function MainNavbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="flex h-15 items-center justify-between gap-2 border-b px-6">
      {/* logo */}
      <div>
        <Link href={"/"}>
          <h1 className="text-3xl">MovieShop</h1>
        </Link>
      </div>
      {/* sign-in, sign-up */}
      <div className="flex gap-2">
        {session ? (
          <SignOutButton />
        ) : (
          <>
            <SignInForm />
            <RegisterForm />
          </>
        )}
      </div>
    </nav>
  );
}
