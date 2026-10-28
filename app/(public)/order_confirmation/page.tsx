"use client";

import { useEffect, useRef, useState } from "react";
import type { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutProgress } from "@/components/checkout_progress";
import Link from "next/link";

/**
 * Visar bekräftelsen för en simulerad beställning.
 *
 * Läser ordern från sessionStorage och visar
 * kunduppgifter, produkter och totalsumma.
 */
export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  /**
   * Hämtar den senast genomförda beställningen.
   */
  useEffect(() => {
    async function loadOrder() {
      // Behåller asynkron inläsning för att undvika
      // synkrona state-uppdateringar i effekten.
      await Promise.resolve();

      const savedOrder = sessionStorage.getItem("lastOrder");

      if (savedOrder) {
        try {
          const parsedOrder: unknown = JSON.parse(savedOrder);

          if (
            parsedOrder !== null &&
            typeof parsedOrder === "object" &&
            !Array.isArray(parsedOrder) &&
            "customer" in parsedOrder &&
            "items" in parsedOrder &&
            Array.isArray(parsedOrder.items)
          ) {
            setOrder(parsedOrder as Order);
          }
        } catch {
          setOrder(null);
        }
      }

      setIsLoaded(true);
    }

    loadOrder();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      headingRef.current?.focus();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="mx-auto my-8 w-[min(90vw,60rem)] p-6">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 box-border w-[min(90vw,60rem)] rounded-xl border border-border bg-card px-4 pt-6 sm:px-6 [&>p]:my-3 [&>p]:text-sm [&>p]:leading-[1.6] [&>p]:text-muted-foreground sm:[&>p]:text-base">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mb-6 text-2xl font-bold text-foreground sm:text-3xl"
      >
        {order ? "Thank you for your order!" : "No order found"}
      </h1>

      {order && <CheckoutProgress currentStep={3} />}

      {!order ? (
        <>
          <p>There is no completed order to display.</p>

          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Home
            </Link>
          </div>
        </>
      ) : (
        <>
          <p>
            Thank you, {order.customer.name}! Your test order has been
            completed.
          </p>

          <p>No real payment has been made.</p>

          {/* Kundens leveransuppgifter */}
          <Card className="my-8 rounded-xl border border-border bg-muted p-5">
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-2">
              <p>{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>
                {order.customer.postcode} {order.customer.city}
              </p>
              <p>Email: {order.customer.email}</p>
            </CardContent>
          </Card>

          {/* Sammanställning av beställda produkter */}
          <Card className="my-8 rounded-xl border border-border bg-muted p-5">
            <CardHeader className="pb-0">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Kolumnrubriker visas från 480 px */}
              <div className="hidden grid-cols-[minmax(0,1fr)_3rem_4.5rem] gap-2 border-b border-border pb-2 text-xs font-semibold text-muted-foreground min-[480px]:grid sm:text-sm">
                <span>Movie</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
              </div>

              {/* Beställda filmer */}
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_3rem_4.5rem] gap-x-2 gap-y-1 border-b border-border py-3 text-sm min-[480px]:items-start"
                >
                  {/* Filmtitel */}
                  <span className="col-span-3 min-w-0 font-medium break-words min-[480px]:col-span-1">
                    {item.title}
                  </span>

                  {/* Antal */}
                  <span className="col-span-2 text-left tabular-nums min-[480px]:col-span-1 min-[480px]:text-center">
                    <span className="min-[480px]:hidden">Quantity: </span>
                    {item.quantity}
                  </span>

                  {/* Pris */}
                  <span className="text-right whitespace-nowrap tabular-nums">
                    {item.price * item.quantity} kr
                  </span>
                </div>
              ))}

              {/* Totalsumma */}
              <div className="mt-2 flex items-center justify-between gap-2 pt-3 font-semibold">
                <span className="shrink-0 text-sm sm:text-xl">Total:</span>

                <span className="shrink-0 text-right text-sm whitespace-nowrap tabular-nums sm:text-xl">
                  {order.total} kr
                </span>
              </div>
            </CardContent>
          </Card>
          {/* Tillbaka till startsidan */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
