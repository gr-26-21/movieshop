"use server";

import {
  TMDBMovieAndCreditsRoot,
  TMDBMovieCreditsRoot,
  TMDBMovieSearchRoot,
  TMDBPersonDetails,
} from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;
const options = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${TMDB_KEY}` },
};

// use with a string containing part of a movie title
// returns a list of movies with matching titles
export async function TMDBGetMovieByQuery(
  query: string
): Promise<TMDBMovieSearchRoot> {
  const result = await fetch(
    `${BASE_URL}/search/movie?query=${query}`,
    options
  );
  return result.json();
}

// use with an int that is an id for a movie on TMDB
// returns a movie object and a list of credits divided into cast and crew
export async function TMDBGetMovieAndCreditsById(
  movieId: number
): Promise<TMDBMovieAndCreditsRoot> {
  const result = await fetch(
    `${BASE_URL}/movie/${movieId}?append_to_response=credits`,
    options
  );
  return result.json();
}

// may be redundant
// use with an int that is an id for a movie on TMDB
// returns a list of credits divided into cast and crew
export async function TMDBGetMovieCreditsById(
  movieId: number
): Promise<TMDBMovieCreditsRoot> {
  const result = await fetch(`${BASE_URL}/movie/${movieId}/credits`, options);
  return result.json();
}

// may be redundant
// use with an int that is an id for a person on TMDB
// returns an object with details of the person
export async function TMDBGetPersonDetailsById(
  personId: number
): Promise<TMDBPersonDetails> {
  const result = await fetch(`${BASE_URL}/person/${personId}`, options);
  return result.json();
}
