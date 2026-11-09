import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileForm from "./profile-form";
import { buttonVariants } from "@/components/ui/button";

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

  const customer = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      address: {
        select: { street: true, postalCode: true, city: true },
      },
    },
  });

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
      <header className="rounded-xl border p-4 text-center">
        <h1 className="text-2xl font-bold">Welcome, {customer.name}!</h1>
      </header>

      <nav
        aria-label="Account sections"
        className="flex flex-wrap justify-center gap-2"
      >
        <Link
          href="#order-history"
          className={buttonVariants({ variant: "outline" })}
        >
          Order history
        </Link>
        <Link
          href="#my-details"
          className={buttonVariants({ variant: "outline" })}
        >
          My details
        </Link>
      </nav>

      <h2 id="order-history" className="text-center text-xl font-semibold">
        Order history
      </h2>

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

      <ProfileForm
        email={customer.email}
        initialValues={{
          name: customer.name,
          address: customer.address?.street ?? "",
          postcode: customer.address?.postalCode ?? "",
          city: customer.address?.city ?? "",
        }}
      />

      <div className="flex justify-center">
        <Link href="/movies" className={buttonVariants()}>
          Browse movies
        </Link>
      </div>
    </main>
  );
}
