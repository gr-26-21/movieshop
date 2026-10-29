import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SignInForm } from "./auth/sign-in-form";
import { RegisterForm } from "./auth/register-form";
import { SignOutButton } from "./sign-out-button";

const linkClassName = buttonVariants({
  variant: "secondary",
  size: "lg",
});

const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about"},
    { label: "Movies", href: "/movies"},
    { label: "Create Movie", href: "/movies/create" },
    // Add Navbar options
];

export default async function MainNavbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="flex h-15 items-center justify-between gap-2 border-b px-6">
      <div>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClassName}>
            {link.label}
          </Link>
        ))}
      </div>
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
