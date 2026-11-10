"use client";

import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout-progress";
import OrderSummary from "@/components/order-summary";
import CheckoutForm from "@/components/checkout-form";
import type { CheckoutFormData } from "@/lib/schemas/checkout.schema";
import type { Order } from "@/types/order";
import { useRef } from "react";

export default function CheckoutClient({
  initialDetails,
}: {
  initialDetails?: CheckoutFormData;
}) {
  const router = useRouter();
  const { cart, clearCart, isLoaded, loadError } = useCart();
  const isSubmittingRef = useRef(false);
  const idempotencyKeyRef = useRef<string | null>(null);

  /**
   * Skapar en simulerad beställning med kunduppgifter
   * och produkterna från varukorgen.
   */
  async function handleCheckout(customer: CheckoutFormData) {
    if (isSubmittingRef.current) {
      return;
    }
    if (!isLoaded || loadError) {
      return;
    }

    if (cart.length === 0) {
      alert("Your shopping cart is empty.");
      return;
    }

    isSubmittingRef.current = true;

    try {
      const orderPayload = {
        customer,
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          expectedPrice: item.price,
        })),
      };

      const orderFingerprint = JSON.stringify({
        customer,
        items: [...orderPayload.items].sort((a, b) => a.id.localeCompare(b.id)),
      });

      const savedKey = sessionStorage.getItem("checkoutIdempotencyKey");
      const savedFingerprint = sessionStorage.getItem(
        "checkoutOrderFingerprint"
      );

      idempotencyKeyRef.current =
        savedKey && savedFingerprint === orderFingerprint
          ? savedKey
          : crypto.randomUUID();

      sessionStorage.setItem(
        "checkoutIdempotencyKey",
        idempotencyKeyRef.current
      );

      sessionStorage.setItem("checkoutOrderFingerprint", orderFingerprint);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current!,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        alert(
          errorData?.error ??
            "Your order could not be completed. Please try again."
        );
        return;
      }

      const data: {
        order: {
          id: string;
          totalAmount: number;
          status: string;
          items: {
            movieId: string;
            quantity: number;
            priceAtPurchase: number;
          }[];
        };
      } = await response.json();

      const total = data.order.totalAmount;
      const order: Order = {
        id: data.order.id,
        customer,
        items: cart.map((item) => {
          const savedItem = data.order.items.find(
            (orderItem) => orderItem.movieId === item.id
          );

          if (!savedItem) {
            throw new Error("Missing order item in server response.");
          }

          return {
            ...item,
            quantity: savedItem.quantity,
            price: savedItem.priceAtPurchase,
          };
        }),
        total,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("lastOrder", JSON.stringify(order));

      sessionStorage.removeItem("checkoutIdempotencyKey");
      sessionStorage.removeItem("checkoutOrderFingerprint");
      idempotencyKeyRef.current = null;

      clearCart();
      router.push("/order_confirmation");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      isSubmittingRef.current = false;
    }
  }

  return (
    <div className="mx-auto my-8 box-border w-[min(90vw,60rem)] rounded-xl border border-border bg-card px-6 pt-6 [&>p]:my-3 [&>p]:leading-[1.6] [&>p]:text-muted-foreground">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Checkout</h1>
      <CheckoutProgress currentStep={2} />

      {loadError ? (
        <p role="alert" className="my-8 text-center">
          {loadError}
        </p>
      ) : !isLoaded ? (
        <p role="status" className="my-8 text-center">
          Loading your shopping cart...
        </p>
      ) : cart.length === 0 ? (
        <p role="status" className="my-8 text-center">
          Your shopping cart is empty. Add a film to continue to checkout.
        </p>
      ) : (
        <>
          <CheckoutForm
            initialDetails={initialDetails}
            onCheckout={handleCheckout}
          />
          <OrderSummary />
        </>
      )}

      {/* Navigering tillbaka till butiken */}

      <div className="mt-4 mb-4 flex justify-center">
        <Link
          href="/"
          className="inline-flex min-h-11 w-full max-w-64 items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto dark:border-red-400 dark:text-red-400 dark:focus-visible:outline-red-400"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
