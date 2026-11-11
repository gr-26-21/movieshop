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
    <nav className="mt-5 mb-8 flex h-16 flex-col items-center justify-between gap-4 px-4 sm:h-20 sm:flex-row sm:px-6 lg:px-15">
      {/* logo */}
      <div className="flex flex-2 flex-row items-center justify-between gap-4">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold sm:text-4xl">MovieShop</h1>
        </Link>
        <div>
          {/* search bar */}
          <div className="flex items-center gap-2">
            <CartLink />
            <SearchMovieByName />
          </div>
        </div>
      </div>

      {/* sign-in, sign-up */}
      <div className="flex w-full flex-col items-center justify-between gap-4 rounded-lg sm:w-auto sm:flex-row sm:gap-8">
        <div className="flex gap-2">
          {session ? (
            <>
              {session.user.role !== "admin" && (
                <Link
                  href="/user"
                  className={buttonVariants({ variant: "outline" })}
                >
                  My account
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <>
              <SignInForm />
              <RegisterForm />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
