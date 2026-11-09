import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminMoviesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const roles =
    session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  // Get active movies
  const movies = await prisma.movie.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Movies</h1>

      <div className="flex gap-2">
        <Link
          href="/admin/movies/create"
          className={buttonVariants({ variant: "secondary", size: "lg" })}
        >
          + Create Movie
        </Link>

        <Link
          href="/admin/movies/discard"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Discarded Movies
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription>
                {movie.description || "No description available"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="line-clamp-2">
                {movie.description?.substring(0, 100)}
              </p>
            </CardContent>

            <CardFooter className="justify-end">
              <Link
                href={`/admin/movies/${movie.id}`}
                className={buttonVariants()}
              >
                Manage Movie
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}