"use client";

import { useCart } from "@/context/cart_context";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CheckoutProgress } from "@/components/checkout_progress";
import CartItemCard from "@/components/cart_item";
import { useEffect, useRef } from "react";

export default function CartPage() {
  const { cart, isLoaded, loadError } = useCart();

  const previousCartIds = useRef(cart.map((item) => item.id));

  useEffect(() => {
    const previousIds = previousCartIds.current;
    const currentIds = cart.map((item) => item.id);

    const removedId = previousIds.find((id) => !currentIds.includes(id));

    previousCartIds.current = currentIds;

    if (removedId === undefined) return;

    const removedIndex = previousIds.indexOf(removedId);

    const nextId = currentIds[removedIndex] ?? currentIds[removedIndex - 1];

    if (nextId !== undefined) {
      const buttons =
        document.querySelectorAll<HTMLButtonElement>("[data-cart-remove]");

      const nextButton = Array.from(buttons).find(
        (button) => button.dataset.cartRemove === String(nextId)
      );

      nextButton?.focus();
    } else {
      document.getElementById("continue-shopping")?.focus();
    }
  }, [cart]);

  /**
   * Varukorgssidan i Movieshop.
   *
   * Visar:
   * - Produkterna i varukorgen.
   * - Aktuellt steg i köpprocessen.
   * - Totalsumman.
   * - Navigering till butik och kassa.
   */

  /**
   * Beräknar varukorgens totalsumma.
   *
   * Pris multipliceras med antal för varje produkt.
   */
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto my-8 box-border w-[min(90vw,60rem)] rounded-xl border border-border bg-card px-6 pt-6 [&>p]:my-3 [&>p]:leading-[1.6] [&>p]:text-muted-foreground">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Shopping Cart</h1>

      <CheckoutProgress currentStep={1} />

      {/* Visar antingen tom varukorg eller produktlistan. */}

      {loadError ? (
        <p role="alert">{loadError}</p>
      ) : !isLoaded ? (
        <p role="status">Loading your shopping cart...</p>
      ) : cart.length === 0 ? (
        <p>Your shopping cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Varukorgens totala pris. */}
      {isLoaded && !loadError && (
        <p className="mx-auto w-[calc(100%-2rem)] pl-4 text-right">
          <strong>Total: {total} kr</strong>
        </p>
      )}

      {/* Navigering mellan butik och checkout. */}
      <div className="mt-4 mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          id="continue-shopping"
          href="/"
          className="inline-flex min-h-11 w-full max-w-64 items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto dark:border-red-400 dark:text-red-400 dark:focus-visible:outline-red-400"
        >
          Continue Shopping
        </Link>

        {isLoaded && !loadError && cart.length > 0 && (
          <Link
            href="/checkout"
            className={buttonVariants({
              variant: "default",
              className:
                "min-h-11 w-full max-w-64 px-6 font-semibold sm:w-auto",
            })}
          >
            Proceed to Checkout
          </Link>
        )}
      </div>
    </div>
  );
}
