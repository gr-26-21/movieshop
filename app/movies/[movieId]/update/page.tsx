import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MovieUpdateForm } from "../_components/movie_update_form";


export default async function MovieUpdatePage(props: PageProps<"/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;
  
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: {
    tmdbId: true,
    id: true,
    title: true,
    description: true,
    price: true,
    releaseDate: true,
    imageUrl: true,
    stock: true,
    runtime: true
    }

  });
  if(!movie) {
    notFound();
  }
  return  (
  <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Update Movie</h1>
      <p>{movie.title}</p>
      <MovieUpdateForm movie={movie}/>
      </div>
  );
}