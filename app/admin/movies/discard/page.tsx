
import prisma from "@/lib/prisma";
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
import RestoreMovieButton from "./_components/restore-movie-button";

export default async function DiscardPage() {
  const deletedMovies = await prisma.movie.findMany({
    where: {
      deletedAt: {
        not: null,
        
      },
    },
    orderBy: {
      deletedAt: "desc",
    },
  });

  // not: null shows all the movies that haven't been deleted.
  // deletedAt shows movies that have been deleted

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Discarded Movies</h1>

      {deletedMovies.length === 0 ? (
        <p>No deleted movies found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {deletedMovies.map((movie) => (
            <Card key={movie.id}>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>
                  Deleted:{" "}
                  {movie.deletedAt?.toLocaleDateString("sv-SE")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="line-clamp-2">
                  {movie.description}
                </p>
              </CardContent>

            <CardFooter className="justify-end">
                <RestoreMovieButton movieId={movie.id} />
            </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Link
        href="/admin/movies"
        className={buttonVariants({ variant: "outline" })}
      >
        Back to Movies
      </Link>
    </div>
  );
}
