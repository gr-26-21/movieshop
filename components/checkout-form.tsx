"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/lib/schemas/checkout.schema";

type CheckoutFormProps = {
  onCheckout: (customer: CheckoutFormData) => void;
};

/**
 * Kundformulär med Zod-validering.
 *
 * Kontrollerar kunduppgifterna innan
 * beställningen skickas vidare.
 */
export default function CheckoutForm({ onCheckout }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  /**
   * Håller reda på om användaren har försökt skicka formuläret.
   * Efter första försöket kan fälten valideras medan användaren skriver.
   */
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /**
   * Validerar ett fält med Zod när användaren ändrar värdet.
   * Uppdaterar endast ett fel som redan har visats.
   */
  function validateField(field: keyof CheckoutFormData, value: string) {
    const result = checkoutSchema.shape[field].safeParse(value);

    setErrors((previous) => {
      // Visa inte nya fel innan användaren försökt beställa.
      if (!hasSubmitted) {
        return previous;
      }

      return {
        ...previous,
        [field]: result.success ? undefined : result.error.issues[0]?.message,
      };
    });
  }

  /**
   * Validerar formuläret vid beställning.
   */

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Markera att användaren har försökt skicka formuläret.
    setHasSubmitted(true);

    const result = checkoutSchema.safeParse({
      name,
      email,
      address,
      postcode,
      city,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        address: fieldErrors.address?.[0],
        postcode: fieldErrors.postcode?.[0],
        city: fieldErrors.city?.[0],
      });

      // Flytta fokus till det första fältet som har ett fel.
      const fieldOrder = [
        "name",
        "email",
        "address",
        "postcode",
        "city",
      ] as const;

      const firstInvalidField = fieldOrder.find(
        (field) => fieldErrors[field]?.length
      );

      if (firstInvalidField) {
        const input = event.currentTarget.elements.namedItem(firstInvalidField);

        if (input instanceof HTMLElement) {
          input.focus();
        }
      }

      return;
    }

    // Rensa tidigare felmeddelanden.
    setErrors({});

    // Fortsätt till befintlig beställningshantering.
    onCheckout(result.data);
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleSubmit} noValidate>
      <h2 className="mb-1 text-xl font-semibold text-foreground">
        Customer Information
      </h2>

      <div className="grid gap-[0.35rem]">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            const value = event.target.value;
            setName(value);
            validateField("name", value);
          }}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-[0.35rem]">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            const value = event.target.value;
            setEmail(value);
            validateField("email", value);
          }}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-[0.35rem]">
        <Label htmlFor="address">Shipping Address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          value={address}
          onChange={(event) => {
            const value = event.target.value;
            setAddress(value);
            validateField("address", value);
          }}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? "address-error" : undefined}
          required
        />
        {errors.address && (
          <p
            id="address-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid gap-[0.35rem]">
        <Label htmlFor="postcode">Postcode</Label>
        <Input
          id="postcode"
          name="postcode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          value={postcode}
          onChange={(event) => {
            const value = event.target.value;
            setPostcode(value);
            validateField("postcode", value);
          }}
          aria-invalid={Boolean(errors.postcode)}
          aria-describedby={errors.postcode ? "postcode-error" : undefined}
          required
        />
        {errors.postcode && (
          <p
            id="postcode-error"
            role="alert"
            className="text-sm text-destructive"
          >
            {errors.postcode}
          </p>
        )}
      </div>

      <div className="grid gap-[0.35rem]">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          type="text"
          autoComplete="address-level2"
          value={city}
          onChange={(event) => {
            const value = event.target.value;
            setCity(value);
            validateField("city", value);
          }}
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? "city-error" : undefined}
          required
        />
        {errors.city && (
          <p id="city-error" role="alert" className="text-sm text-destructive">
            {errors.city}
          </p>
        )}
      </div>

      <Button className="my-4 w-full" type="submit">
        Place Order
      </Button>
    </form>
  );
}
