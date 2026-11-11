import prisma from "./prisma";

// top 5 most purchased movie
export async function mostPurchasedMovies() {
  const purchasedMovies = await prisma.orderItem.groupBy({
    by: ["movieId"],
    where: {
      order: {
        status: "PAID",
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const movieIds = purchasedMovies.map((m) => m.movieId);

  return await prisma.movie.findMany({
    where: {
      id: {
        in: movieIds,
      },
      deletedAt: null,
    },
  });
}

// top 5 most recent movies
export async function mostRecentMovies() {
  return await prisma.movie.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      releaseDate: "desc",
    },
    take: 5,
  });
}

// top 5 oldest moveis
export async function oldestMovies() {
  return await prisma.movie.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      releaseDate: "asc",
    },
    take: 5,
  });
}

// top 5 cheapest movies
export async function cheapestMovies() {
  return await prisma.movie.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      price: "asc",
    },
    take: 5,
  });
}
