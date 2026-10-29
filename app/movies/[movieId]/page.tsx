import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function MovieDetailsPage(
  props: PageProps<"/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      persons: {
        include: {
          person: true,
        },
      },
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <div className="space-y-2 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{movie.title}</h1>

        <Link href="/movies" className={buttonVariants({ variant: "outline" })}>
          Back to List
        </Link>
      </div>

      <h2 className="text-black-500 mt-2 text-lg font-bold">
        Persons: {movie.persons.length}
      </h2>

      <p>Release Date: {movie.releaseDate.toLocaleDateString("sv-SE")}</p>

      <h2 className="text-gray-500">
        Director:{" "}
        {movie.persons.find((item) => item.role === "DIRECTOR")?.person.name ??
          "No director"}
      </h2>
      <AddToCartButton
        product={{
          id: movie.id,
          title: movie.title,
          price: movie.price,
          description: movie.description,
          imageUrl: movie.imageUrl,
        }}
        disabled={movie.stock <= 0}
      />
    </div>
  );
}
