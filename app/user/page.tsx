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
      shippingName: true,
      shippingStreet: true,
      shippingPostalCode: true,
      shippingCity: true,
      shippingCountry: true,
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
            <h3 className="font-semibold break-all">Order {order.id}</h3>
            <p>{order.createdAt.toLocaleDateString("sv-SE")}</p>
            <p>Status: {order.status}</p>
            <p className="font-semibold">Total: {order.totalAmount} kr</p>

            <details className="space-y-3">
              <summary className="w-fit cursor-pointer rounded font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                View details
              </summary>

              <h4 className="font-semibold">Items</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.movie.title} — {item.quantity} ×{" "}
                    {item.priceAtPurchase} kr
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold">Delivery address</h4>
              <div className="wrap-break-word">
                <p>{order.shippingName}</p>
                <p>{order.shippingStreet}</p>
                <p>
                  {order.shippingPostalCode} {order.shippingCity}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </details>
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
