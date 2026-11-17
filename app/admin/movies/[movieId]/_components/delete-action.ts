"use server";

import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// SOFT DELETE MOVIE
export async function softDeleteMovie(movieId: string): Promise<void> {
const adminSession = await getAdminSession();

if (adminSession.status !== "authorized") {
  redirect("/movies");
}

  const result = await prisma.movie.updateMany({
    where: {
      id: movieId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  if (result.count === 0) {
    redirect("/admin/movies?toast=not-found");
  }

  revalidatePath("/movies");
  revalidatePath("/admin/movies");
  revalidatePath("/admin/movies/discard");

  redirect("/admin/movies?toast=deleted");
}

// RESTORE MOVIE
// Find a deleted movie by its ID and restore it by setting deletedAt to null.
// This means the movie is no longer marked as deleted in the database.

export async function restoreMovie(movieId: string): Promise<void> {
const adminSession = await getAdminSession();

if (adminSession.status !== "authorized") {
  redirect("/movies");
}

  const result = await prisma.movie.updateMany({
    where: {
      id: movieId,
      deletedAt: { not: null },
    },
    data: {
      deletedAt: null,
    },
  });

  if (result.count === 0) {
    redirect("/admin/movies/discard?toast=not-found");
  }

  revalidatePath("/movies");
  revalidatePath("/admin/movies");
  revalidatePath("/admin/movies/discard");

  redirect("/admin/movies/discard?toast=restored");
}
