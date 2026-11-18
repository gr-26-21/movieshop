"use server";

import {
  connectGenreToMovie,
  connectPersonToMovie,
  createMovie,
  formatInputToUppercaseFirst,
} from "@/app/admin/movies/create/_components/create-action";
import { getAdminSession } from "@/lib/auth-helpers";
import prisma from "@/lib/prisma";
import {
  TMDBCastCredits,
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

// --- TMDB DATA FETCHING ---

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

//helper function to compress this step in other functions
export async function TMDBGetAndConvertMovieAndCreditsById(
  tmdbId: number,
  price: number,
  stock: number
) {
  const movie = await TMDBGetMovieAndCreditsById(tmdbId);
  return TMDBConvertMovieFormatToLocal(movie, price, stock);
}

// --- TMDB GENRE POPULATION ---

export async function TMDBFetchGenres(): Promise<TMDBGenreRoot> {
  const result = await fetch(`${BASE_URL}/genre/movie/list`, options);
  return result.json();
}

export async function TMDBCreateGenre(name: string, tmdbId: number) {
  // admin access-----
  const adminSession = await getAdminSession();

  if (adminSession.status !== "authorized") {
    return;
  }
  //-----------------
  const genreName = await formatInputToUppercaseFirst(name);
  try {
    await prisma.genre.upsert({
      where: {
        name: genreName,
      },
      update: {
        tmdbId: tmdbId,
      },
      create: {
        name: genreName,
        tmdbId: tmdbId,
      },
    });
    console.log(name + " genre created!");
  } catch (error) {
    console.error("TMDB genre upsert error: " + error);
  }
}

//genre seeding, should be run before creating a movie with tmdb
export async function TMDBSeedGenre() {
  const tmdbGenres = await TMDBFetchGenres();
  tmdbGenres.genres.map(async (result) => {
    await TMDBCreateGenre(result.name, result.id);
  });
}

//a basic check for if genres may already exist instead of just requesting them every time
//not very reliable
export async function TMDBGenreCheck() {
  const tmdbGenres = await prisma.genre.findFirst({
    where: {
      tmdbId: {
        not: null,
      },
    },
  });
  if (tmdbGenres === null) {
    TMDBSeedGenre();
  } else {
    console.log(
      "Some TMDB genres exist, one or more may still be missing. Run seeding function manually to ensure proper population"
    );
  }
}

// --- TMDB CREATE AND CONNECT FUNCTIONS ---

//helper function to compress
export async function TMDBCreateMovie(movie: TMDBCreateMovieConversion) {
  return createMovie(movie, movie.tmdbid);
}

type CreatePersonInput = { tmdbid: number; name: string };

//creates a person with data from a tmdb response
export async function TMDBcreatePerson(input: CreatePersonInput) {
  // admin access--------
  const adminSession = await getAdminSession();

  if (adminSession.status !== "authorized") {
    return "0";
  }
  // ----------------------
  let personId: string;
  try {
    const person = await prisma.person.upsert({
      where: {
        tmdbId: input.tmdbid,
      },
      update: {},
      create: {
        tmdbId: input.tmdbid,
        name: input.name,
      },
    });
    personId = person.id.toString();
    return personId;
  } catch (error) {
    console.error("Failed to create person. Error", error);
    return "0";
  }
}

//adds cast from tmdb credits to a movie and returns a list of person IDs
export async function TMDBcreateAndConnectCastFromCredits(
  credits: TMDBCastCredits[],
  movieId: string
) {
  try {
    const CastIdList = credits.map(async (result) => {
      const person = { tmdbid: result.id, name: result.name };
      const personId = await TMDBcreatePerson(person);
      await connectPersonToMovie(personId, movieId, "ACTOR");
      console.log(person.name + " Added as Actor");
      return personId;
    });
    console.log("Finished adding Cast");
    return CastIdList;
  } catch (error) {
    console.error("Create cast error: ", error);
  }
}

//adds crew from tmdb credits to a movie and returns a list of person IDs
//made so that "DIRECTOR" could be changed to "CREW" to allow other crew jobs than director
export async function TMDBcreateAndConnectCrewFromCredits(
  credits: TMDBCrewCredits[],
  movieId: string
) {
  try {
    const CrewIdList = credits.map(async (result) => {
      const person = { tmdbid: result.id, name: result.name };
      const personId = await TMDBcreatePerson(person);
      await connectPersonToMovie(personId, movieId, "DIRECTOR");
      console.log(person.name + '"added as ' + result.job);
      return personId;
    });
    console.log("Finished adding Crew");
    return CrewIdList;
  } catch (error) {
    console.error("Create crew error: ", error);
  }
}

//helper function to convert tmdb movie data to the format our db uses
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

    imageUrl: TMDBMovieResult.poster_path
      ? `https://image.tmdb.org/t/p/w500${TMDBMovieResult.poster_path}`
      : "", 

    imageUrl:
      "https://image.tmdb.org/t/p/original" + TMDBMovieResult.poster_path,

    stock: stock,
    runtime: TMDBMovieResult.runtime,
    tmdbid: TMDBMovieResult.id,
  };
  return movie;
}

//helper function to filter out directors from crew
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

//one big function that takes the tmdb id of a movie, price, and stock
// to add and connect everything relating to that movie
//NOTE: make sure "await TMDBSeedGenre" has run before this function can be used
// to avoid missing genres
export default async function TMDBAddAndConnectAllByMovieId(
  tmdbId: number,
  price: number,
  stock: number
) {
  //unreliable fail-safe in case genre was not seeded properly
  await TMDBGenreCheck();
  try {
    //fetch data from tmdb and convert it to the format of our database
    const fetchResult = await TMDBGetMovieAndCreditsById(tmdbId);
    const genres = fetchResult.genres;
    const preparedMovie = await TMDBConvertMovieFormatToLocal(
      fetchResult,
      price,
      stock
    );

    //create movie
    const movieId = await TMDBCreateMovie(preparedMovie);
    if (!movieId) {
      console.error("Movie creation failed of ID: " + tmdbId);
      return "Movie creation failed of ID: " + tmdbId;
    }

    //add cast to movie
    const cast = await TMDBcreateAndConnectCastFromCredits(
      fetchResult.credits.cast,
      movieId
    );
    if (!cast) {
      console.error("Failed to add cast");
      return "Failed to add cast";
    }

    //find and add director to movie
    const director = await TMDBFilterDirector(fetchResult.credits.crew);

    if (!director) {
      console.error("Failed to find director");
      return "Failed to find director";
    }

    const crew = await TMDBcreateAndConnectCrewFromCredits(director, movieId);
    if (!crew) {
      console.error("Failed to add crew");
      return "Failed to add crew";
    }

    //add genres to movie
    const genre = genres.map(async (genre) => {
      //why does it only console.log the first genre added?
      return await connectGenreToMovie(genre.name, movieId);
    });
    if (!genre) {
      console.error("Failed to add genres");
      return "Failed to add genres";
    }

    console.log("Reached end of create and connect ALL");
    return movieId;
  } catch (error) {
    console.error(
      "Failed to add movie with TMDBID: '" + tmdbId + "'. Error:" + error
    );
    return false; //what would be good to return here?
  }
}

// --- SEEDING FUNCTIONS ---

export async function TMDBSeedMoviesFromIdList(input: number[]) {
  try {
    input.map(async (movie) => {
      TMDBAddAndConnectAllByMovieId(movie, 299, 1);
    });
    console.log("Seeding successful!");
    return true;
  } catch (error) {
    console.error("Seeding failed. Error: " + error);
    return false; //how to make it keep running even if a movie fails to add until it's completed the list?
  }
}

export async function TMDBGetPopularMovies() {
  try {
    const root: Promise<TMDBMovieSearchRoot> = (
      await fetch(`${BASE_URL}/movie/popular`, options)
    ).json();
    const movies = (await root).results;
    const idList = movies.map((movie) => {
      return movie.id;
    });
    return idList;
  } catch (error) {
    console.error("Fetch popular movies failed: " + error);
  }
}

export async function TMDBSeedPopularMovies() {
  const movies = await TMDBGetPopularMovies();
  if (!movies) {
    console.error(
      "Error: TMDBGetPopularMovies() failed to compile list of IDs"
    );
    return false;
  }
  return await TMDBSeedMoviesFromIdList(movies);
}

export async function TMDBGetTopRatedMovies() {
  try {
    const root: Promise<TMDBMovieSearchRoot> = (
      await fetch(`${BASE_URL}/movie/top_rated`, options)
    ).json();
    const movies = (await root).results;
    const idList = movies.map((movie) => {
      return movie.id;
    });
    return idList;
  } catch (error) {
    console.error("Fetch popular movies failed: " + error);
  }
}

export async function TMDBSeedTopRatedMovies() {
  const movies = await TMDBGetTopRatedMovies();
  if (!movies) {
    console.error(
      "Error: TMDBGetPopularMovies() failed to compile list of IDs"
    );
    return false;
  }
  return await TMDBSeedMoviesFromIdList(movies);
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
