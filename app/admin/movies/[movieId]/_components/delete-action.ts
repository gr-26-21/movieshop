"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function isAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  return roles.includes("admin");
}

// SOFT DELETE MOVIE
export async function softDeleteMovie(movieId: string): Promise<void> {
  if (!(await isAdmin())) {
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
  if (!(await isAdmin())) {
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
