import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { buttonVariants } from "@/components/ui/button";
import MovieCard from "@/app/(public)/_components/movie-card";
import prisma from "@/lib/prisma";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;

  const movie = await prisma.movie.findFirst({
    where: { id: movieId, deletedAt: null },
    include: {
      genres: true,
      persons: {
        where: { role: "DIRECTOR" },
        include: { person: true },
      },
    },
  });

  if (!movie) notFound();

  return (
    <main className="mx-auto max-w-lg space-y-4 p-6">
      <Link href="/movies" className={buttonVariants({ variant: "outline" })}>
        Back to movies
      </Link>

      <MovieCard
        title={movie.title}
        price={movie.price}
        releaseDate={movie.releaseDate.getFullYear()}
        imgURL={null}
        actions={
          <div className="w-full space-y-3">
            <p>{movie.description}</p>
            <p>
              Director:{" "}
              {movie.persons.map(({ person }) => person.name).join(", ") ||
                "No director"}
            </p>
            <p>
              Genre:{" "}
              {movie.genres.map(({ name }) => name).join(", ") || "No genres"}
            </p>
            <p>
              {movie.stock > 0 ? `In stock: ${movie.stock}` : "Out of stock"}
            </p>

            <AddToCartButton
              product={{
                id: movie.id,
                title: movie.title,
                price: movie.price,
                description: movie.description,
                imageUrl: movie.imageUrl,
                stock: movie.stock,
              }}
              disabled={movie.stock <= 0}
            />
          </div>
        }
      />
    </main>
  );
}
