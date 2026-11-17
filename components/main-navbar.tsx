import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SignInForm } from "./auth/sign-in-form";
import { RegisterForm } from "./auth/register-form";
import { SignOutButton } from "./sign-out-button";
import SearchMovieByName from "./search-movie-byName";
import { buttonVariants } from "@/components/ui/button";
import { CartLink } from "./cart-link";

export default async function MainNavbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="mt-8 mb-10 flex w-full flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-12 lg:px-16">
      {/* Logo */}
      <div className="flex items-center">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold sm:text-4xl">MovieShop</h1>
        </Link>
      </div>

      {/* Search bar */}
      <div className="mx-auto w-full max-w-xl px-4 sm:px-6 lg:max-w-2xl lg:flex-1 lg:px-8">
        <SearchMovieByName />
      </div>

      {/* Sign-in, sign-up / User actions */}
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg sm:w-auto sm:flex-row sm:gap-4">
        <div className="flex items-center gap-2">
          {session ? (
            <>
              {session.user.role !== "admin" && (
                <>
                  <CartLink />

                  <Link
                    href="/user"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    My account
                  </Link>
                </>
              )}
              <SignOutButton />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <SignInForm />
              <RegisterForm />
              <CartLink />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
