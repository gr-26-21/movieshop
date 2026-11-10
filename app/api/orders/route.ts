import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/schemas/order.schema";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  let body: unknown;
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (
    !idempotencyKey ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      idempotencyKey
    )
  ) {
    return NextResponse.json(
      { error: "A valid Idempotency-Key is required." },
      { status: 400 }
    );
  }

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
  const customer = result.data.customer;
  try {
    const existingOrder = await prisma.order.findUnique({
      where: {
        idempotencyKey,
      },
      select: {
        id: true,
        userId: true,
        customerName: true,
        customerEmail: true,
        shippingName: true,
        shippingStreet: true,
        shippingPostalCode: true,
        shippingCity: true,
        totalAmount: true,
        status: true,
        items: {
          select: {
            movieId: true,
            quantity: true,
            priceAtPurchase: true,
          },
        },
      },
    });

    if (existingOrder) {
      const sameCustomer =
        existingOrder.userId === (session?.user.id ?? null) &&
        existingOrder.customerName === customer.name &&
        existingOrder.customerEmail === customer.email &&
        existingOrder.shippingName === customer.name &&
        existingOrder.shippingStreet === customer.address &&
        existingOrder.shippingPostalCode === customer.postcode &&
        existingOrder.shippingCity === customer.city;

      const sameItems =
        existingOrder.items.length === result.data.items.length &&
        result.data.items.every((item) =>
          existingOrder.items.some(
            (savedItem) =>
              savedItem.movieId === item.id &&
              savedItem.quantity === item.quantity
          )
        );
      if (!sameCustomer || !sameItems) {
        return NextResponse.json(
          { error: "This idempotency key belongs to a different order." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Order already exists.",
          order: {
            id: existingOrder.id,
            totalAmount: existingOrder.totalAmount,
            status: existingOrder.status,
            items: existingOrder.items,
          },
        },
        { status: 200 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const transactionMovies = await tx.movie.findMany({
        where: {
          deletedAt: null,
          id: {
            in: movieIds,
          },
        },
        select: {
          id: true,
          price: true,
          stock: true,
        },
      });

      if (transactionMovies.length !== movieIds.length) {
        throw new Error("MOVIE_NOT_FOUND");
      }

      for (const item of result.data.items) {
        const movie = transactionMovies.find((movie) => movie.id === item.id);

        if (!movie) {
          throw new Error("MOVIE_NOT_FOUND");
        }

        if (movie.price !== item.expectedPrice) {
          throw new Error("PRICE_CHANGED");
        }
      }

      const totalAmount = result.data.items.reduce((total, item) => {
        const movie = transactionMovies.find((movie) => movie.id === item.id);

        if (!movie) {
          throw new Error("MOVIE_NOT_FOUND");
        }

        return total + movie.price * item.quantity;
      }, 0);

      for (const item of result.data.items) {
        const updated = await tx.movie.updateMany({
          where: {
            id: item.id,
            deletedAt: null,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count !== 1) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      return tx.order.create({
        data: {
          idempotencyKey,
          userId: session?.user.id ?? null,
          status: "PAID",
          customerName: customer.name,
          customerEmail: customer.email,
          shippingName: customer.name,
          shippingStreet: customer.address,
          shippingPostalCode: customer.postcode,
          shippingCity: customer.city,
          totalAmount,
          items: {
            create: result.data.items.map((item) => {
              const movie = transactionMovies.find(
                (movie) => movie.id === item.id
              );

              if (!movie) {
                throw new Error("MOVIE_NOT_FOUND");
              }

              return {
                movieId: item.id,
                quantity: item.quantity,
                priceAtPurchase: movie.price,
              };
            }),
          },
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          items: {
            select: {
              movieId: true,
              quantity: true,
              priceAtPurchase: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("idempotencyKey")
    ) {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey },
        select: {
          id: true,
          userId: true,
          customerName: true,
          customerEmail: true,
          shippingName: true,
          shippingStreet: true,
          shippingPostalCode: true,
          shippingCity: true,
          totalAmount: true,
          status: true,
          items: {
            select: {
              movieId: true,
              quantity: true,
              priceAtPurchase: true,
            },
          },
        },
      });

      if (!existingOrder) {
        return NextResponse.json(
          { error: "Unable to retrieve the existing order. Please try again." },
          { status: 503 }
        );
      }

      const sameCustomer =
        existingOrder.userId === (session?.user.id ?? null) &&
        existingOrder.customerName === customer.name &&
        existingOrder.customerEmail === customer.email &&
        existingOrder.shippingName === customer.name &&
        existingOrder.shippingStreet === customer.address &&
        existingOrder.shippingPostalCode === customer.postcode &&
        existingOrder.shippingCity === customer.city;

      const sameItems =
        existingOrder.items.length === result.data.items.length &&
        result.data.items.every((item) =>
          existingOrder.items.some(
            (savedItem) =>
              savedItem.movieId === item.id &&
              savedItem.quantity === item.quantity
          )
        );

      if (!sameCustomer || !sameItems) {
        return NextResponse.json(
          { error: "This idempotency key belongs to a different order." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Order already exists.",
          order: {
            id: existingOrder.id,
            totalAmount: existingOrder.totalAmount,
            status: existingOrder.status,
            items: existingOrder.items,
          },
        },
        { status: 200 }
      );
    }
    if (error instanceof Error && error.message === "PRICE_CHANGED") {
      return NextResponse.json(
        {
          code: "PRICE_CHANGED",
          error:
            "A movie price has changed. Please reload checkout to review the updated total before trying again.",
        },
        { status: 409 }
      );
    }
    if (error instanceof Error && error.message === "MOVIE_NOT_FOUND") {
      return NextResponse.json(
        { error: "One or more movies are no longer available. Please reload checkout to update your cart." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey },
        select: {
          id: true,
          userId: true,
          customerName: true,
          customerEmail: true,
          shippingName: true,
          shippingStreet: true,
          shippingPostalCode: true,
          shippingCity: true,
          totalAmount: true,
          status: true,
          items: {
            select: {
              movieId: true,
              quantity: true,
              priceAtPurchase: true,
            },
          },
        },
      });
      if (existingOrder) {
        const sameCustomer =
          existingOrder.userId === (session?.user.id ?? null) &&
          existingOrder.customerName === customer.name &&
          existingOrder.customerEmail === customer.email &&
          existingOrder.shippingName === customer.name &&
          existingOrder.shippingStreet === customer.address &&
          existingOrder.shippingPostalCode === customer.postcode &&
          existingOrder.shippingCity === customer.city;

        const sameItems =
          existingOrder.items.length === result.data.items.length &&
          result.data.items.every((item) =>
            existingOrder.items.some(
              (savedItem) =>
                savedItem.movieId === item.id &&
                savedItem.quantity === item.quantity
            )
          );

        if (sameCustomer && sameItems) {
          return NextResponse.json(
            {
              success: true,
              message: "Order already exists.",
              order: {
                id: existingOrder.id,
                totalAmount: existingOrder.totalAmount,
                status: existingOrder.status,
                items: existingOrder.items,
              },
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          { error: "This idempotency key belongs to a different order." },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Not enough stock available." },
        { status: 409 }
      );
    }

    console.error("Failed to create order:", error);

    return NextResponse.json(
      { error: "Unable to create the order. Please try again later." },
      { status: 503 }
    );
  }
}
