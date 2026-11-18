"use server";

import { PersonRole } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth-helpers";
import { z } from "zod";

// --- MOVIES ---

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

//Admin checker
export async function checkAdmin() {
  const result = await getAdminSession();
  if (result.status === "authorized") {
    return true;
  }
  console.error("Error: User not admin.");
  return false;
}
type CreateMovieInput = z.input<typeof createMovieSchema>;

//creates a movie with input either from a tmdb data or a manual form
export async function createMovie(input: CreateMovieInput, tmdbId?: number) {
  if (!(await checkAdmin())) {
    return null;
  }

  // Validate information on the server
  const result = createMovieSchema.safeParse(input);
  if (!result.success) {
    return null;
  }

  try {
    const data = result.data;

    const movie = await prisma.movie.create({
      data: {
        tmdbId: tmdbId,
        title: data.title,
        description: data.description,
        price: data.price,
        releaseDate: new Date(data.releaseDate),
        imageUrl: data.imageUrl,
        stock: data.stock,
        runtime: data.runtime,
      },
    });
    return movie.id;
  } catch (error) {
    console.error("Failed to create movie. Error:", error);
    return null;
  }
}

// --- PERSONS ---

const createPersonSchema = z.object({
  name: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),
});

type CreatePersonInput = z.input<typeof createPersonSchema>;

//untested but should create a new person
export async function createPerson(input: CreatePersonInput) {
  if (!(await checkAdmin())) {
    return null;
  }

  // Validate information on the server
  const result = createPersonSchema.safeParse(input);
  if (!result.success) {
    return null;
  }

  try {
    const person = await prisma.person.create({
      data: {
        name: input.name,
      },
    });
    const personId = person.id.toString();
    return personId;
  } catch (error) {
    console.error("Failed to create person: " + input.name + ". Error", error);
    return null;
  }
}

export async function findPersonById(personId: string) {
  try {
    const result = await prisma.person.findUnique({
      where: {
        id: personId,
      },
      select: {
        name: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Failed to find person. Error:", error);
    return "Unknown Person";
  }
}

export async function connectPersonToMovie(
  personId: string,
  movieId: string,
  role: PersonRole
) {
  if (!(await checkAdmin())) {
    return;
  }

  try {
    await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        persons: {
          create: {
            role: role,
            person: {
              connect: {
                id: personId,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Failed to connect person and movie[" +
        personId +
        movieId +
        "]. Error: " +
        error
    );
  }
}

// --- GENRES ---

//enter genre name to create, or update if already existing, case-insensitive.
export async function createOrUpdateGenre(name: string, description?: string) {
  if (!(await checkAdmin())) {
    return null;
  }

  const genreName = await formatInputToUppercaseFirst(name);
  try {
    await prisma.genre.upsert({
      where: {
        name: genreName,
      },
      update: {
        description: description,
      },
      create: {
        name: genreName,
        description: description,
      },
    });
    return genreName;
  } catch (error) {
    console.error("Failed to create genre. Error: " + error);
  }
}

//find genre by name, returns ID, case-insensitive
export async function findGenreIdByName(name: string) {
  const genreName = await formatInputToUppercaseFirst(name);
  try {
    const result = await prisma.genre.findUnique({
      where: {
        name: genreName,
      },
    });
    return result;
  } catch {
    console.error("Genre not found. Error: " + genreName);
    return null;
  }
}

//find genre by ID, returns full genre information, case-insensitive
export async function findGenreById(genreId: string) {
  try {
    const result = await prisma.genre.findUnique({
      where: {
        id: genreId,
      },
    });
    return result;
  } catch {
    console.error("Genre not found ID. Error: " + genreId);
    return null;
  }
}

//connects genre to a movie using the id from both respectively
export async function connectGenreToMovie(name: string, movieId: string) {
  if (!(await checkAdmin())) {
    return null;
  }

  const genreName = await formatInputToUppercaseFirst(name);
  try {
    await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        genres: {
          connect: {
            name: genreName,
          },
        },
      },
    });
    console.log("Genre connected: " + genreName);
    return genreName;
  } catch (error) {
    console.error("Couldn't connect genre to movie. Error: " + error);
    return null;
  }
}

//helper function to make multi-word strings capitalize the first letter of each word
export async function formatInputToUppercaseFirst(input: string) {
  const result = input
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    })
    .join(" ");
  return result;
}
