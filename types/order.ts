import type { CartItem } from "@/context/cart-context";
import type { CheckoutFormData } from "@/lib/schemas/checkout.schema";

export type Order = {
  id?: string;
  customer: CheckoutFormData;
  items: CartItem[];
  total: number;
  createdAt: string;
};
