import { z } from "zod";

/**
 * Valideringsschema för kunduppgifter i kassan.
 */

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .refine(
      (value) => value.split(/\s+/).length >= 2,
      "Please enter both your first and last name."
    ),

  email: z.email("Please enter a valid email address."),

  address: z
    .string()
    .trim()
    .min(5, "The address must contain at least 5 characters."),

  postcode: z
    .string()
    .trim()
    .regex(
      /^\d{3}\s?\d{2}$/,
      "Please enter a valid postcode, for example 591 35."
    ),

  city: z
    .string()
    .trim()
    .min(2, "The city must contain at least 2 characters.")
    .regex(/^[\p{L}\s'-]+$/u, "Please enter a valid city."),
});

/**
 * TypeScript-typ som skapas från Zod-schemat.
 */
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
