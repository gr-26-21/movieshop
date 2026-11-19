"use server";

import {
  TMDBSeedPopularMovies,
  TMDBSeedTopRatedMovies,
} from "./tmdb-action";

export async function importPopularMovies() {
  return await TMDBSeedPopularMovies();
}

export async function importTopRatedMovies() {
  return await TMDBSeedTopRatedMovies();
}