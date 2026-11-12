import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import MovieCard from "@/app/(public)/_components/movie-card";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.search;

  const movies = await prisma.movie.findMany({
    where: {
      deletedAt: null,
      ...(searchQuery
        ? {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: {
      genres: true,
      persons: {
        where: {
          role: "DIRECTOR",
        },
        include: {
          person: true,
        },
      },
    },
    orderBy: [{ title: "desc" }],
  });

  return (
    <div className="space-y-4 p-6">
      {searchQuery && (
        <h1 className="text-2xl font-bold">
          Search results for &quot;{searchQuery}&quot; ({movies.length})
        </h1>
      )}

      {movies.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No movies found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              price={movie.price}
              releaseDate={movie.releaseDate.getFullYear()}
              imgURL={movie.imageUrl}
              actions={
                <div className="w-full space-y-3">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Director:{" "}
                      {movie.persons
                        .map((entry) => entry.person.name)
                        .join(", ") || "No director"}
                    </p>
                    <p>
                      Genre:{" "}
                      {movie.genres.map((genre) => genre.name).join(", ") ||
                        "No genres"}
                    </p>
                    <p className="line-clamp-2">
                      {movie.description.substring(0, 100)}
                    </p>
                    <p>
                      {movie.stock > 0
                        ? `In stock: ${movie.stock}`
                        : "Out of stock"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
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
                    <Link
                      href={`/movies/${movie.id}`}
                      className={buttonVariants({ variant: "link" })}
                    >
                      View Movie
                    </Link>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
