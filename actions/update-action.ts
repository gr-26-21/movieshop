"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

// UPDATE
const updateMovieSchema = z.object({
  id: z.string().min(1, "Please provide a valid movie ID"),
  title: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),

  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  releaseDate: z.iso.date("Release date is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  stock: z.string().min(1, "Stock is required"),
  runtime: z.string().min(1, "Runtime is required"),
  person: z.string().min(1, "Person is required"),
  director: z.string().min(1, "Director is required"),
});

type UpdateMovieInput = z.input<typeof updateMovieSchema>;

export async function updateMovie(input: UpdateMovieInput) {
try {
  const data = updateMovieSchema.parse(input);

  const updatedMovie = await prisma.movie.update({
    where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        releaseDate: new Date(data.releaseDate),
        imageUrl: data.imageUrl,
        stock: Number(data.stock),
        runtime: Number(data.runtime),
        person: data.person, // connectOrCreate with TmdBId: data.tmdbId
      }
  })
  revalidatePath("/movies");
  redirect(`/movies/${data.id}`);
} catch (err) {
  if (err instanceof z.ZodError) {
    return false;
  }
  throw err;
}
}

// export async function updateMovie(
//   input: UpdateMovieInput,
//   shouldRedirect = true
// ) {
//   let data: z.infer<typeof updateMovieSchema>;

//   try {
//     data = updateMovieSchema.parse(input);

//     const person = await prisma.person.upsert({
//       where: { name: data.person },
//       update: {},
//       create: { name: data.person },
//     });

    
// let director = await prisma.director.findFirst({
//   where: { name: data.director },
// });

// if (!director) {
//   director = await prisma.director.create({
//     data: { name: data.director },
//   });
// }

// await prisma.movie.update({
//   where: { id: data.id },
//   data: {
//     title: data.title,
//     description: data.description,
//     price: parseInt(data.price),
//     person: {
//       connect: {
//         id: person.id,
//       },
//     },
//     releaseDate: new Date(data.releaseDate),
//     director: {
//       connect: {
//         id: director.id,
//       },
//     },
//     imageUrl: data.imageUrl,
//     stock: parseInt(data.stock),
//     runtime: parseInt(data.runtime),
//   },
// });


//     revalidatePath("/movies");
//     revalidatePath(`/movies/${data.id}`);
//   } catch (err) {
//     console.error(err);

//     if (err instanceof z.ZodError) {
//       return false;
//     }

//     throw err;
//   }

//   if (shouldRedirect) {
//     redirect(`/movies/${data.id}?toast=updated`);
//   }

//   return true;
// }