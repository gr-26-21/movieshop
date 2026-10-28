"use client";

import { useCart } from "@/context/cart_context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Visar en sammanställning av kundens beställning.
 *
 * Hämtar produkter och antal från CartContext.
 * Beräknar totalsumman utifrån produkternas priser.
 */
export default function OrderSummary() {
  const { cart } = useCart();

  // Beräkna den totala kostnaden för beställningen.
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="mt-8 rounded-xl border border-border bg-muted p-5">
      <CardHeader>
        <CardTitle>Your Order</CardTitle>
      </CardHeader>

      <CardContent>
        {cart.length === 0 ? (
          <p>Your shopping cart is empty.</p>
        ) : (
          <div>
            {/* Kolumnrubriker visas från 480 px */}
            <div className="hidden grid-cols-[minmax(0,1fr)_3rem_4.5rem] gap-2 border-b border-border pb-2 text-xs font-semibold text-muted-foreground min-[480px]:grid sm:text-sm">
              <span>Movie</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
            </div>

            {/* Filmerna i varukorgen */}

            {cart.map((item) => (
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

            <div className="mt-2 flex items-center justify-between gap-2 pt-3 font-semibold">
              <span className="shrink-0 text-sm sm:text-xl">Total:</span>

              <span className="shrink-0 text-right text-sm whitespace-nowrap tabular-nums sm:text-xl">
                {total} kr
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
