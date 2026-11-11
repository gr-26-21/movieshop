"use server";

import prisma from "@/lib/prisma";
import {
  TMDBCreateMovieConversion,
  TMDBCrewCredits,
  TMDBGenreRoot,
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

//TMDB genre population
export async function TMDBFetchGenres(): Promise<TMDBGenreRoot> {
  const result = await fetch(`${BASE_URL}/genre/movie/list`, options);
  return result.json();
}

export async function TMDBCreateGenre(name: string, tmdbId: number) {
  try {
    await prisma.genre.upsert({
      where: {
        tmdbId: tmdbId,
      },
      update: {},
      create: {
        name: name,
        tmdbId: tmdbId,
      },
    });
    console.log(name + " genre created!");
  } catch {
    console.log("genre exists");
  }
}

//adds the list of genres from TMDB
export async function TMDBSeedGenre() {
  const tmdbGenres = await TMDBFetchGenres();
  tmdbGenres.genres.map((result) => {
    TMDBCreateGenre(result.name, result.id);
  });
}

//are these not just kinda dupes? fix this.
//a check for if genres may already exist instead of just requesting them every time
export async function TMDBGenreCheck() {
  const tmdbGenres = await prisma.genre.findFirst({
    where: {
      tmdbId: {
        not: null,
      },
    },
  });
  if (tmdbGenres === null) {
    // const genres = await TMDBFetchGenres();
    // genres.genres.map((result) => {
    //   TMDBCreateGenre(result.name, result.id);
    //   console.log(result.name + " genre created!");
    // });
    TMDBSeedGenre(); //should be all?
  } else {
    console.log(
      "Some TMDB genres exist, one or more may still be missing. Run seeding function manually to ensure proper population"
    );
  }
}

export async function TMDBConvertMovieFormatToLocal(
  TMDBMovieResult: TMDBMovieAndCreditsRoot,
  price: number,
  stock: number
) {
  const movie: TMDBCreateMovieConversion = {
    title: TMDBMovieResult.title,
    description: TMDBMovieResult.overview,
    price: price,
    releaseDate: TMDBMovieResult.release_date,
    imageUrl: TMDBMovieResult.poster_path,
    stock: stock,
    runtime: TMDBMovieResult.runtime,
    tmdbid: TMDBMovieResult.id,
  };
  return movie;
}

export async function TMDBFilterDirector(
  crewList: TMDBCrewCredits[]
): Promise<TMDBCrewCredits[] | false> {
  const directors = crewList.filter((result) => result.job === "Director");
  if (directors.length === 0) {
    console.error("Failed to find director");
    return false;
  }
  return directors;
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
