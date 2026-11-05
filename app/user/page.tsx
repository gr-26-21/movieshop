import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function UserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">My orders</h1>
        <p>Please sign in to view your orders.</p>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      items: {
        select: {
          id: true,
          quantity: true,
          priceAtPurchase: true,
          movie: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">My orders</h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <section key={order.id} className="space-y-3 rounded-xl border p-4">
            <h2 className="font-semibold break-all">Order {order.id}</h2>
            <p>{order.createdAt.toLocaleDateString("sv-SE")}</p>
            <p>Status: {order.status}</p>

            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.movie.title} — {item.quantity} × {item.priceAtPurchase}{" "}
                  kr
                </li>
              ))}
            </ul>

            <p className="font-semibold">Total: {order.totalAmount} kr</p>
          </section>
        ))
      )}

      <Link href="/movies" className="underline">
        Browse movies
      </Link>
    </main>
  );
}
