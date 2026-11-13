import {
  cheapestMovies,
  mostPurchasedMovies,
  mostRecentMovies,
  oldestMovies,
} from "@/lib/movie-actions";

import SelectedMovies from "./_components/selected-movies";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// The main page component for the public section of the application
export default async function HomePage() {
  const [recent, oldest, cheapest, purchased] = await Promise.all([
    mostRecentMovies(),
    oldestMovies(),
    cheapestMovies(),
    mostPurchasedMovies(),
  ]);

  return (
    <>
      <div className="px-6 sm:px-12 lg:px-15">
        <div className="flex items-center justify-end">
          <Link href="/movies" className={buttonVariants()}>
            View All
          </Link>
        </div>
        <div>
          <SelectedMovies
            title="Top 5 most recent movies"
            moviesList={recent}
          />
          <SelectedMovies
            title="Top 5 most purchased movies"
            moviesList={purchased}
          />
          <SelectedMovies title="Top 5 oldest movies" moviesList={oldest} />
          <SelectedMovies title="Top 5 cheapest movies" moviesList={cheapest} />
        </div>
      </div>
    </>
  );
}
