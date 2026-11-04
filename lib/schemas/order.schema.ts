import { z } from "zod";
import { checkoutSchema } from "@/lib/schemas/checkout.schema";


export const orderItemSchema = z.object({
  id: z.string().min(1, "Movie ID is required."),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than zero."),
});

export const createOrderSchema = z.object({
  customer: checkoutSchema,
  items: z
    .array(orderItemSchema)
    .min(1, "The order must contain at least one movie.")
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "The same movie cannot appear more than once."
    ),
});
