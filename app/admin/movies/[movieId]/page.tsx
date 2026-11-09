
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import SoftDeleteMovieButton from "./_components/movie-delete-button";

export default async function MovieDetailsPage(
  props: PageProps<"/admin/movies/[movieId]">
) {
  const params = await props.params;
  const movieId = params.movieId;

 // Find movie ID and include it if not deleted yet
 // Retrieve ACTOR 
 // Person: true will retrieve associated Person to get name of person
 // Commented version is down below if clashing with TMDB
  const movie = await prisma.movie.findFirst({
    where: {
      id: movieId,
      deletedAt: null,
    },
include: {
  persons: {
    include: {
      person: true,
    },
  },
  },
  });

  // show a 404 page if movie doesnt exist or if its been deleted
  if (!movie) {
    notFound();
  }

  const credits = movie.persons;

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">
        {movie.title}
      </h1>


            <h2 className="text-xl font-semibold">
        Directors

        {/* if result < 0 display:  No directors added */}
      </h2>

      <h2 className="text-xl font-semibold">
        Actors

        {/* if result < 0 display:  No actors added */}
      </h2>



      <div>
        {/* Map proccesses each actor in the credits array */}
        {/* key is used to render lists (from result.id relationship records) */}
        {/* Display persons name - and role (Leonardo Dicaprio - ACTOR ) */}
        {credits.map((result) => (
          <div key={result.id}>
            {result.person.name} - {result.role}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/admin/movies/${movie.id}/update`}
          className={buttonVariants({ variant: "outline" })}
        >
          Update Movie
        </Link>

        <SoftDeleteMovieButton movieId={movie.id} />
      </div>

      <p className="max-w-prose whitespace-pre-line">
        {movie.description}
      </p>
    </div>
  );
}

// Commented version is down below if clashing with TMDB

// import prisma from "@/lib/prisma";
// import { notFound } from "next/navigation";
// import { MovieDeleteDialog } from "./_components/movie-delete-dialog";
// import { buttonVariants } from "@/components/ui/button";
// import Link from "next/link";
// import SoftDeleteMovieButton from "./_components/movie-delete-button";

// export default async function MovieDetailsPage(
//   props: PageProps<"/admin/movies/[movieId]">
// ) {
//   const params = await props.params;
//   const movieId = params.movieId;


  
//   const movie = await prisma.movie.findUnique({
//     where: { id: movieId },
//     include: {
//       persons: {
//         where: {
//           role: "ACTOR",
//         },
//       },
//     },
//   });
//   if (!movie) {
//     notFound();
//   }

//   const credits = movie.persons;
//   const creditPersons = credits.map((result) => {
//      prisma.person.findUnique({
//       where: {
//         id: result.personId
//       }
//     })
//   });



//   return (
//     <div className="space-y-2 p-6">
//       <h1 className="text-3xl font-bold">
//         title: {movie.title + movie.persons}
//       </h1>
//       {/* <p>{creditPersons}</p> */}
//       <p>{credits.map( (result) =>{
//         return(
//           <div key={result.id}>{result.id + " " + result.role}</div>
//         )
//       })}</p>
//       <h2 className="text-xl font-semibold">
//         {/* Director: {movie.director?.name ?? "Deleted Director"} */}
//         {/* Actor: {movie.actor?.name ?? "Deleted Actor"} */}
//       </h2>

//       <div className="flex gap-2">
//         <Link href={`/admin/movies/${movie.id}/update`} className={buttonVariants({ variant: "outline" })}
//         >
//           Update Movie
//           </Link>
//       <SoftDeleteMovieButton movieId={movie.id} />
//       <p className="max-w-prose whitespace-pre-line">{movie.description}</p>
//     </div>
//     </div>
//   );
// }