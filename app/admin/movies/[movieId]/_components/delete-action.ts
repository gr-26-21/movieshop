
"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// DELETE
export async function deleteMovie(
  movieId: string,
  redirectTo?: string
) {
  await prisma.movie.delete({
    where: { id: movieId },
  });

  revalidatePath("/movies");
  // revalidatePath("/admin/movies");
  redirect(`${redirectTo ?? "/movies"}?toast=deleted`);
}