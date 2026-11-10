import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <CheckoutClient />;
  }

  const customer = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      address: {
        select: { street: true, postalCode: true, city: true },
      },
    },
  });

  if (!customer) {
    return <CheckoutClient />;
  }

  return (
    <CheckoutClient
      key={session.user.id}
      initialDetails={{
        name: customer.name,
        email: customer.email,
        address: customer.address?.street ?? "",
        postcode: customer.address?.postalCode ?? "",
        city: customer.address?.city ?? "",
      }}
    />
  );
}