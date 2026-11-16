"use server";

import { PersonRole } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { TMDBCastCredits, TMDBCrewCredits } from "@/types/tmdb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

type CreateMovieInput = z.input<typeof createMovieSchema>;

//created a movie with input either from a tmdb data or a manual form
export async function createMovie(input: CreateMovieInput, tmdbId?: number) {
  // Control login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  // Control Admin role
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    return false;
  }

  // Validate information on the server
  const result = createMovieSchema.safeParse(input);
  if (!result.success) {
    return false;
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
    return movie.id; //returns the movieId to use for an external redirect[remove this note before finalizing]
  } catch (error) {
    console.error("Failed to create movie. Error:", error);
    return false; //decide what we want to return for error
  }
}

// --- PERSONS ---

type CreatePersonInput = { name: string };

//untested but should create a new person
export async function createPerson(input: CreatePersonInput) {
  let personId: string;
  try {
    const person = await prisma.person.create({
      data: {
        name: input.name,
      },
    });
    personId = person.id.toString();
    return personId;
  } catch (error) {
    console.error("Failed to create person. Error", error);
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
    console.error("Failed to connect person and movie. Error: " + error);
  }
}

// --- GENRES ---

//enter genre name to create, or update if already existing, case-insensitive.
export async function createOrUpdateGenre(name: string, description?: string) {
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
    .toString()
    .split(" ")
    .map(function (word) {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" "); //couldn't do tostring here without it being type () => string?
  //why did toString have to be done here separately?
  return result.toString();
}
