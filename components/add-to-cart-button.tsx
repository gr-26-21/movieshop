"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
  disabled?: boolean;
};

export function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const { addToCart, isLoaded, loadError } = useCart();

  return (
    <Button
      type="button"
      disabled={disabled || !isLoaded || !!loadError}
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </Button>
  );
}
