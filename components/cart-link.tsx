"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

export function CartLink() {
  const { cart } = useCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  const [previousCount, setPreviousCount] = useState(count);
  const [shouldBounce, setShouldBounce] = useState(false);

  if (count !== previousCount) {
    setPreviousCount(count);
    setShouldBounce(count > previousCount);
  }

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart (${count})`}
      className={buttonVariants({ variant: "ghost" })}
    >
      <ShoppingCart aria-hidden="true" />
      {count > 0 && (
        <span
          key={count}
          aria-hidden="true"
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white ${
            shouldBounce
              ? "motion-safe:animate-bounce motion-safe:[animation-iteration-count:1]"
              : ""
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
