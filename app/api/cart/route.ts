import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Hämtar aktuella filmuppgifter till kundvagnen.
 *
 * Film-ID skickas som query-parametrar:
 * /api/cart?ids=id1&ids=id2
 *
 * Priser och filminformation hämtas från databasen,
 * aldrig från cookien.
 */
export async function GET(request: NextRequest) {
  const ids = [
    ...new Set(
      request.nextUrl.searchParams
        .getAll("ids")
        .filter((id) => id.trim().length > 0)
    ),
  ];

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  if (ids.length > 100) {
    return NextResponse.json(
      { error: "Too many movies requested." },
      { status: 400 }
    );
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Failed to fetch movies for the shopping cart:", error);

    return NextResponse.json(
      { error: "Failed to fetch movies for the shopping cart:" },
      { status: 500 }
    );
  }
}
