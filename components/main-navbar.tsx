import Link from "next/link";
import { buttonVariants } from "./ui/button";

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

export function MainNavbar() {
    return (
        <nav className="flex h-15 items-center gap-2 border-b  px-6">
            {links.map((link) => (
                <Link key={link.href} href={link.href} className=
                {linkClassName}>
                    {link.label}
                    </Link>
            ))}
            </nav>
    );
}
