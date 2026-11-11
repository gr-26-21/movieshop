import { Movie } from "@/generated/prisma/client";
import MovieCard from "./movie-card";

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
            <div key={movie.id} className="w-75 shrink-0 gap-3 rounded-lg">
              <MovieCard
                title={movie.title}
                price={movie.price}
                releaseDate={movie.releaseDate.getFullYear()}
                imgURL={movie.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
