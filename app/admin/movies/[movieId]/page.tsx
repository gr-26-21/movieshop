import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import SoftDeleteMovieButton from "./_components/movie-delete-button";

export default async function MovieDetailsPage(
  props: PageProps<"/admin/movies/[movieId]">
) {
  // Control login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Control admin login
  const roles = session.user.role?.split(",").map((role) => role.trim()) ?? [];

  if (!roles.includes("admin")) {
    redirect("/");
  }

  // Get movie ID
  const params = await props.params;
  const movieId = params.movieId;

  // Get movie if it's not discarded
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

  // 404 if movie is not existing or discarded
  if (!movie) {
    notFound();
  }

  const credits = movie.persons;

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">{movie.title}</h1>

      <h2 className="text-xl font-semibold">Directors</h2>
      {/* if result < 0 display:  No directors added */}

      <h2 className="text-xl font-semibold">Actors</h2>
      {/* if result < 0 display:  No actors added */}
      <div>
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

      <p className="max-w-prose whitespace-pre-line">{movie.description}</p>
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
