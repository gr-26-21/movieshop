import type { CartItem } from "@/context/cart-context";
import type { CheckoutFormData } from "@/lib/schemas/checkout.schema";

export type Order = {
  customer: CheckoutFormData;
  items: CartItem[];
  total: number;
  createdAt: string;
};
