"use client";

import type { CartItem } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Trash2 } from "lucide-react";

type CartItemProps = {
  item: CartItem;
};

/**
 * Visar en produkt i varukorgen.
 *
 * Responsiv layout med tillgängliga knappar för att
 * öka, minska och ta bort produkter.
 */
export default function CartItemCard({ item }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  /**
   * Begär bekräftelse innan produkten tas bort.
   */
  function handleRemove() {
    if (
      window.confirm(
        `Do you want to remove ${item.title} from the shopping cart?`
      )
    ) {
      removeFromCart(item.id);
    }
  }

  return (
    <Card className="mx-auto mb-4 w-full p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Produktinformation */}
        <div>
          <h2 className="text-xl font-semibold">{item.title}</h2>

          <p className="text-sm text-muted-foreground">{item.price} kr each</p>
        </div>

        {/* Antal och produktåtgärder */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Quantity: {item.quantity}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity for ${item.title}`}
            >
              <Minus aria-hidden="true" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => increaseQuantity(item.id)}
              aria-label={`Increase quantity for ${item.title}`}
            >
              <Plus aria-hidden="true" />
            </Button>

            <Button
              type="button"
              variant="destructive"
              data-cart-remove={item.id}
              onClick={handleRemove}
              aria-label={`Remove ${item.title} from the shopping cart`}
            >
              <Trash2 aria-hidden="true" />
              Remove
            </Button>
          </div>
        </div>

        {/* Produktens delsumma */}
        <div className="border-t border-border pt-3">
          <p className="text-right font-semibold">
            Subtotal: {item.price * item.quantity} kr
          </p>
        </div>
      </div>
    </Card>
  );
}
