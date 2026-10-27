import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function MovieUpdatePage(props: PageProps<"/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;
  
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { persons: true },

  });
  if(!movie) {
    notFound();
  }
  return  (
  <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Update Movie</h1>
      <p>{movie.title}</p>
      {/* MovieUpdateForm */}
      </div>
  );
}