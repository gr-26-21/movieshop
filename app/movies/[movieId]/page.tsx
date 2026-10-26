import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MovieDeleteDialog } from "./_components/movie-delete-dialog";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { MovieUpdateDrawer } from "./update/_components/movie_update_drawer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default async function MovieDetailsPage(
  props: PageProps<"/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;
  
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: { director: true },

  });
  if(!movie) {
    notFound();
  }

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <h2 className="text-xl font-semibold">
        Director: {movie.director?.name ?? "Deleted Director"}
        Actor: {movie.actor?.name ?? "Deleted Actor"}
      </h2>

      <MovieDeleteDialog movieId={movie.id} redirectTo="/"/>
      <p>{movie.description}</p>
    </div>
  );
}
  
  
  


// model Movie {

//   tmdbId Int @unique

//   id          String   @id @default(cuid())
//   title       String
//   description String
//   price       Int
//   releaseDate DateTime
//   imageUrl    String?
//   stock       Int
//   runtime     Int
 
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
 
//   // authorId   Int?
//   // directorId Int?
 
//   // author   Author?   @relation(fields: [authorId], references: [id])
//   // director Director? @relation(fields: [directorId], references: [id])
 
//   genres Genre[]
//   persons MoviePerson[]
//   orderItems OrderItem[]
// }


  //     props: PageProps<"/movies/[movieId]">
// ) {
//     const params = await props.params;
//     const movieId = parseInt(params.movieId);
//     if (Number.isNaN(movieId)) {
//         notFound();
//     }
//     const movie = await prisma.movie.findUnique({
//         where: { id: movieId },
//         include: { person: true}, 
//     });

//     if (!movie) {
//         notFound();
//     }
    
// return (
  
// <div className="space-y-2 p-6">

//   <div className="flex items-center justify-between">
//     <h1 className="text-3xl font-bold">
//       {movie.title}
//     </h1>

//     <Link
//       href="/listing"
//       className={buttonVariants({ variant: "outline" })}
//     >
//       Back to List
//     </Link>
//   </div>

//   <h2 className="mt-2 text-lg text-black-500 font-bold">
//     Person: {movie.person?.name ?? "Deleted Person"}
//   </h2>

//   <p>
//     Release Date: {movie.releaseDate.toLocaleDateString("sv-SE")}
//   </p>

//   <h2 className="text-gray-500">
//     Director: {movie.director?.name ?? "Deleted Director"}

//     <div className="flex gap-2">

// <MovieUpdateDrawer
//   movie={{
//     id: movie.id,
//     title: movie.title,
//     person: movie.person?.name ?? "Deleted Person",
//     releaseDate: new Date(movie.releaseDate),
//     director: movie.director?.name ?? "Deleted Director",
//   }}
// />

//         <MovieDeleteDialog movieId={movie.id} redirectTo="/movies" /> 
//         </div>
//     </h2>
//   </div>
// );
// }
