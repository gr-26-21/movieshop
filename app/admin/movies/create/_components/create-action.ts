"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const createMovieSchema = z.object({
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

type CreateMovieInput = z.input<typeof createMovieSchema>;

export async function createMovie(input: CreateMovieInput) {
  // Control login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  // Control Admin role
  const roles =
    session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    return false;
  }

  //   // Validate information on the server
  const result = createMovieSchema.safeParse(input);

  if (!result.success) {
    return false;
  }

  // Create movie
  let movieId: string;

  try {
    const data = result.data;

    const movie = await prisma.movie.create({
      data: {
        tmdbId: Math.floor(Math.random() * 100000), //temporary test, properly implement after testing
        title: data.title,
        description: data.description,
        price: data.price,
        releaseDate: new Date(data.releaseDate),
        imageUrl: data.imageUrl,
        stock: data.stock,
        runtime: data.runtime,
      },
    });

    movieId = movie.id;
  } catch (error) {
    console.error("Failed to create movie:", error);
    return false;
  }

  redirect(`/admin/movies/${movieId}`);
}