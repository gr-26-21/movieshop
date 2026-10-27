"use server";

import prisma from "@/lib/prisma";
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
  imageUrl: z.string().min(1, "Image URL is required"),
  stock: z.number().min(1, "Stock is required"),
  runtime: z.number().min(1, "Runtime is required"),
});

type CreateMovieInput = z.input<typeof createMovieSchema>;

export async function createMovie(input: CreateMovieInput) {
  try {
    const data = createMovieSchema.parse(input);

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
      // Fixa sedan update genom att kopiera data o kasta in den i update data
    });

    const movieId = movie.id;
    redirect(`/movies/${movieId}`);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return false;
    }
    // throw err;
    return false;
  }
}
// zod library works by validating data which will return clena validated / transformed data since
// we might do trnasforms in this schema, uppercase/trims
// parse means validate

// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import z from "zod";

// // CREATE
// const createMovieSchema = z.object({
//   title: z
//     .string()
//     .min(3, "Title has to be at least 3 characters")
//     .max(75, "Title must be at most 75 characters"),

//   description: z.string().min(1, "Description is required"),
//   price: z.string().min(1, "Price is required"),
//   releaseDate: z.iso.date("Release date is required"),
//   imageUrl: z.string().min(1, "Image URL is required"),
//   stock: z.string().min(1, "Stock is required"),
//   runtime: z.string().min(1, "Runtime is required"),
// });

// type CreateMovieInput = z.input<typeof createMovieSchema>;

// export async function createMovie(input: CreateMovieInput) {
//   let movieId: string;

//   try {
//     const data = createMovieSchema.parse(input);

//     const person = await prisma.person.upsert({
//       where: { name: data.person },
//       update: {},
//       create: { name: data.person },
//     });

//     // Reuse an existing director or create one if needed
//     let director = await prisma.director.findFirst({
//       where: { name: data.director },
//     });

//     if (!director) {
//       director = await prisma.director.create({
//         data: { name: data.director },
//       });
//     }

//     const movie = await prisma.movie.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         price: parseInt(data.price, 10),
//         releaseDate: new Date(data.releaseDate),
//         imageUrl: data.imageUrl,
//         stock: parseInt(data.stock, 10),
//         runtime: parseInt(data.runtime, 10),
//         person: {
//           connect: { id: person.id },
//         },
//         director: {
//           connect: { id: director.id },
//         },
//       },
//     });

//     movieId = movie.id;
//   } catch (err) {
//     console.error(err);

//     if (err instanceof z.ZodError) {
//       return false;
//     }

//     return false;
//   }

//   revalidatePath("/movies");
//   redirect(`/movies/${movieId}?toast=created`);
// }
