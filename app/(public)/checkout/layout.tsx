import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your movie order at Movieshop.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
