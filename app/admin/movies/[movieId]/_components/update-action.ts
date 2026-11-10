"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// UPDATE SCHEMA
const updateMovieSchema = z.object({
  id: z.string().min(1, "Please provide a valid movie ID"),
  title: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  releaseDate: z.iso.date("Release date is required"),
  imageUrl: z.string(),
  stock: z.number().min(1, "Stock is required"),
  runtime: z.number().min(1, "Runtime is required"),
});

type UpdateMovieInput = z.input<typeof updateMovieSchema>;

export async function updateMovie(
  input: UpdateMovieInput,
  shouldRedirect = true
) {
  // Control Login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  // Control admin role
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    return false;
  }

  // Validate information on the server
  const result = updateMovieSchema.safeParse(input);

  if (!result.success) {
    return false;
  }

  const data = result.data;

  try {
    // Only update an active movie
    const updatedMovie = await prisma.movie.updateMany({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        releaseDate: new Date(data.releaseDate),
        imageUrl: data.imageUrl,
        stock: data.stock,
        runtime: data.runtime,
      },
    });

    if (updatedMovie.count === 0) {
      return false;
    }
  } catch (error) {
    console.error("Failed to update movie:", error);
    return false;
  }

  // Update Cache
  revalidatePath("/movies");
  revalidatePath("/admin/movies");
  revalidatePath(`/admin/movies/${data.id}`);

  if (shouldRedirect) {
    redirect(`/admin/movies/${data.id}`);
  }

  return true;
}
