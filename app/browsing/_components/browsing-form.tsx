"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

interface BrowsingFormProps {
  movies: {
    id: string;
    title: string;
    description: string;
    price: number;
    releaseDate: Date;
    imageUrl?: string | null;
    stock: number;
    runtime: number;
    person: {
      name: string;
    } | null;
  }[];
}

export default function BrowsingForm({ movies }: BrowsingFormProps) {
  const [search, setSearch] = useState("");

  const filteredMovies = movies.filter((movie) => {
    const searchTerm = search.toLowerCase();

    return (
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.person?.name.toLowerCase().includes(searchTerm) ||
      movie.description.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search + Create */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search by title, genre, director or person."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-md"
        />

        <Link
          href="/movies/create"
          className={buttonVariants()}
        >
          Create New Movie
        </Link>
      </div>

      {/* Results */}
      {filteredMovies.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <Card
              key={movie.id}
              className="group flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {movie.title}
                </CardTitle>

                <CardDescription>
                  {movie.person?.name ?? "Deleted Person"}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    Published
                  </span>

                  <span>
                    {movie.releaseDate.toLocaleDateString("sv-SE")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    Price
                  </span>

                  <span className="font-mono text-xs">
                    ${movie.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Link
                  href={`/movies/${movie.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  View Movie
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">
            No movies found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Try searching for another title, genre, director or person
          </p>

          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}