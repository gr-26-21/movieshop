import type { CartItem } from "@/context/cart_context";
import type { CheckoutFormData } from "@/schemas/checkout_schema";

export type Order = {
  customer: CheckoutFormData;
  items: CartItem[];
  total: number;
  createdAt: string;
};
