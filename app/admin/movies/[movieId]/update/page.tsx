import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { MovieUpdateForm } from "../_components/movie_update_form";

export default async function MovieUpdatePage(
  props: PageProps<"/admin/movies/[movieId]/update">
) {
  // Control login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Control admin role
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  // Get movieId
  const params = await props.params;
  const movieId = params.movieId;

  // Get only active movies
  const movie = await prisma.movie.findFirst({
    where: {
      id: movieId,
      deletedAt: null,
    },
    select: {
      tmdbId: true,
      id: true,
      title: true,
      description: true,
      price: true,
      releaseDate: true,
      imageUrl: true,
      stock: true,
      runtime: true,
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Update Movie</h1>
      <p>{movie.title}</p>
      <MovieUpdateForm movie={movie} />
    </div>
  );
}
