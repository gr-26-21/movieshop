import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MovieDeleteDialog } from "./_components/movie-delete-dialog";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MovieDetailsPage(
  props: PageProps<"/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      persons: {
        where: {
          role: "ACTOR",
        },
      },
    },
  });
  if (!movie) {
    notFound();
  }

  const credits = movie.persons;
  const creditPersons = credits.map((result) => {
     prisma.person.findUnique({
      where: {
        id: result.personId
      }
    })
  });



  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">
        title: {movie.title + movie.persons}
      </h1>
      {/* <p>{creditPersons}</p> */}
      <p>{credits.map( (result) =>{
        return(
          <div key={result.id}>{result.id + " " + result.role}</div>
        )
      })}</p>
      <h2 className="text-xl font-semibold">
        {/* Director: {movie.director?.name ?? "Deleted Director"} */}
        {/* Actor: {movie.actor?.name ?? "Deleted Actor"} */}
      </h2>

      <div className="flex gap-2">
        <Link href={`/movies/${movie.id}/update`} className={buttonVariants({ variant: "outline" })}
        >
          Update Movie
          </Link>
      <MovieDeleteDialog movieId={movie.id} redirectTo="/movies" />
      <p className="max-w-prose whitespace-pre-line">{movie.description}</p>
    </div>
    </div>
  );
}