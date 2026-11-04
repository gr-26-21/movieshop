import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/schemas/order.schema";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
  }

  const result = createOrderSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid order data.",
        details: result.error.flatten(),
      },
      { status: 400 }
    );
  }

  const movieIds = result.data.items.map((item) => item.id);

  let movies;

  try {
    movies = await prisma.movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      select: {
        id: true,
        stock: true,
        price: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch movies for order:", error);

    return NextResponse.json(
      {
        error: "Unable to process the order right now. Please try again later.",
      },
      { status: 503 }
    );
  }

  if (movies.length !== movieIds.length) {
    return NextResponse.json(
      { error: "One or more movies could not be found." },
      { status: 400 }
    );
  }

  for (const item of result.data.items) {
    const movie = movies.find((movie) => movie.id === item.id);

    if (movie && item.quantity > movie.stock) {
      return NextResponse.json(
        {
          error: "Not enough stock available.",
          movieId: item.id,
          requestedQuantity: item.quantity,
          availableStock: movie.stock,
        },
        { status: 400 }
      );
    }
  }

  const totalAmount = result.data.items.reduce((total, item) => {
    const movie = movies.find((movie) => movie.id === item.id);

    if (!movie) return total;

    return total + movie.price * item.quantity;
  }, 0);

  return NextResponse.json({
    success: true,
    message: "Order data validated successfully.",
    totalAmount,
  });
}
