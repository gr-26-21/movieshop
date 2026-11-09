
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// SOFT DELETE (where deletedAt gets a new date to mark that its been deleted)
export async function softDeleteMovie(movieId: string) {
  await prisma.movie.update({
    where: {
      id: movieId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/admin/movies");
  redirect("/admin/movies?toast=deleted");
}

// find (where: { ... ) and restore a deleted movie by making its deletedAt null = deletedAt = null then the movie is not deleted 
// by updating an existing movie record in DB.
export async function restoreMovie(movieId: string) {
  await prisma.movie.update({
    where: {
      id: movieId,
    },
    data: {
      deletedAt: null,
    },
  });

  revalidatePath("/admin/movies");
  revalidatePath("/admin/movies/discard");

  redirect("/admin/movies/discard?toast=restored");
}
