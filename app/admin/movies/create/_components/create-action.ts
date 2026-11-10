"use server";

import { PersonRole } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { TMDBCastCredits, TMDBCrewCredits } from "@/types/tmdb";
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

//created a movie with input either from a tmdb respone or a manual form
export async function createMovie(input: CreateMovieInput, tmdbId?: number) {
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
    return movie.id; //now returns the movieId to use for an external redirect instead[remove this note before finalizing]
  } catch (error) {
    console.error("Failed to create movie:", error);
    return false; //decide if we want to return an error
  }
}

//  !!EVERYTHING BELOW THIS POINT IS UNFINISHED WORK-IN-PROGRESS THAT SHOULD NOT BE USED YET!!

type CreatePersonInput = { tmdbid: number; name: string };

//currently creates a person with input from a tmdb response
//TODO: make compatible with manual create if plausible.
// If it would take a separate if block, make a separate function unless other parts are worth it.
export async function createPerson(input: CreatePersonInput) {
  let personId: string;
  try {
    const person = await prisma.person.upsert({
      where: {
        tmdbId: input.tmdbid,
      },
      update: {},
      create: {
        tmdbId: input.tmdbid,
        name: input.name,
      },
    });
    personId = person.id;
  } catch (error) {
    console.error("Failed to create person:", error);
    return "Person Error:";
  }
  return personId;
}

export async function findPersonById(personId: string) {
  let name: string | undefined;
  try {
    const result = await prisma.person.findUnique({
      where: {
        id: personId,
      },
      select: {
        name: true,
      },
    });
    name = result?.name;
  } catch (error) {
    console.error("Find person failed. Error:", error);
    const defaultErrorPersonh: string = "John Error";
    return defaultErrorPersonh;
  }
  return name;
}
export async function createAndConnectCastFromTMDBCredits(
  credits: TMDBCastCredits[],
  movieId: string
) {
  const creditPersonIdList = credits.map((result) => {
    const tmdbid = result.id;
    const name = result.name;
    const person = { tmdbid, name };
    // const persontest = {result.id, result.name} //why not?
    const personId = createPerson(person).toString();
    connectPersonToMovie(personId, movieId, "ACTOR");
    return 'Added "' + personId + '" as Actor';
  });
  //maybe remove
  // const connectionConfirmation = creditPersonIdList.map((result) => {
  //   const personId = result.toString();
  //   connectPersonToMovie(personId, movieId);
  //   const person = findPersonById(personId).toString();
  //   return `Connected person: ${person}`;
  // });
  return creditPersonIdList;
}

//made so that "DIRECTOR" could be changed to "CREW" to allow other crew jobs than director
export async function createAndConnectCrewFromTMDBCredits(
  credits: TMDBCrewCredits[],
  movieId: string
) {
  const creditPersonIdList = credits.map((result) => {
    const tmdbid = result.id;
    const name = result.name;
    const person = { tmdbid, name };
    const personId = createPerson(person).toString();
    connectPersonToMovie(personId, movieId, "DIRECTOR");
    return 'Added "' + personId + '" as ' + result.job;
  });
  return creditPersonIdList;
}

export async function connectPersonToMovie(
  personId: string,
  movieId: string,
  role: PersonRole
) {
  await prisma.movie.update({
    where: {
      id: movieId,
    },
    data: {
      persons: {
        connect: {
          id: personId,
          role: role,
        },
      },
    },
  });
}
