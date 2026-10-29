import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Link from "next/link";


export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    include: {
      id: true,
      title: true,
      description: true,
      director: true,
      genres: true,
      price: true,
      releaseDate: true,
      imageUrl: true,
      stock: true,
    },
    orderBy: [{ title: "desc" }] 
    // order by trendy? :)
  });

  return (
    <div className="space-y-2 p-6">
      <h1 className="text-3xl font-bold">Movies Page</h1>
      <h2 className="text-xl font-semibold">This is the movies page.</h2>
    {movies.map((movie) => (
        <Card key={movie.id}>
        <CardHeader>
            <CardTitle>{movie.title}</CardTitle>
            <CardDescription>
                {/* Director: {movie.director?.name ?? "Deleted Director"}
                Genre: {movie.genres.map((genre) => genre.name).join(", ") || "No genres"}  */}
            </CardDescription> 
        </CardHeader>
        <CardContent>
            <p className="line-clamp-2">{movie.description.substring(0, 100)}</p>
            <p className="line-clamp-2">{movie.price}</p>
            <p className="line-clamp-2">{movie.releaseDate.toLocaleDateString("sv-SE")}</p>
        </CardContent>
        <CardContent>
            <p className="line-clamp-2">
             {movie.imageUrl
                ? movie.imageUrl.substring(0, 100)
                : "No image URL available"}
            </p>
        
        <CardDescription>
        {movie.stock > 0 ? "In stock" : "Out of stock"}
        </CardDescription>
        </CardContent>
        <CardFooter className="justify-end">
                          <Link 
              href={`/movies/${movie.id}`}
              className={buttonVariants({ variant: "link" })}
              >
                View Movie
                </Link>
        </CardFooter>
        </Card>
    ))}
    
    </div>
  );
}
