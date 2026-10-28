"use client";

import { useCart } from "@/context/cart_context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout_progress";
import OrderSummary from "@/components/order_summary";
import CheckoutForm from "@/components/checkout_form";
import type { CheckoutFormData } from "@/schemas/checkout_schema";
import type { Order } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoaded, loadError } = useCart();

  /**
   * Skapar en simulerad beställning med kunduppgifter
   * och produkterna från varukorgen.
   */
  function handleCheckout(customer: CheckoutFormData) {
    if (!isLoaded || loadError) {
      return;
    }

    if (cart.length === 0) {
      alert("Your shopping cart is empty.");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: Order = {
      customer,
      items: cart,
      total,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("lastOrder", JSON.stringify(order));

    clearCart();
    router.push("/order_confirmation");
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
          <CheckoutForm onCheckout={handleCheckout} />
          <OrderSummary />
        </>
      )}

      {/* Navigering tillbaka till butiken */}

      <div className="mt-4 mb-4 flex justify-center">
        <Link
          href="/"
          className="inline-flex min-h-11 w-full max-w-64 items-center justify-center rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto dark:border-red-400 dark:text-red-400 dark:focus-visible:outline-red-400"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
