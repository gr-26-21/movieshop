import { Movie } from "@/generated/prisma/client";
import MovieCard from "./movie-card";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default function SelectedMovies({
  title,
  moviesList,
}: {
  title: string;
  moviesList: Movie[];
}) {
  return (
    <>
      <div>
        <h2 className="text-3xl font-semibold">{title}</h2>
        <div className="grid grid-cols-1 justify-items-center gap-5 p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {moviesList.map((movie) => (
            <div key={movie.id} className="w-full max-w-75 min-w-0">
              <MovieCard
                title={movie.title}
                price={movie.price}
                releaseDate={movie.releaseDate.getFullYear()}
                imgURL={movie.imageUrl}
                outOfStock={movie.stock <= 0}
                actions={
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
                }
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
