"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./update-profile";

type ProfileFields = {
  name: string;
  address: string;
  postcode: string;
  city: string;
};

const fields = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "address", label: "Street address", autoComplete: "street-address" },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code" },
  { name: "city", label: "City", autoComplete: "address-level2" },
] as const;

export default function ProfileForm({
  email,
  initialValues,
}: {
  email: string;
  initialValues: ProfileFields;
}) {
  const [values, setValues] = useState(initialValues);
  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    message: "",
  });

  return (
    <section
      id="my-details"
      aria-labelledby="profile-heading"
      className="scroll-mt-4 space-y-4 rounded-xl border p-4"
    >
      <h2 id="profile-heading" className="text-xl font-semibold">
        My details
      </h2>
      <p className="text-sm break-all">Email: {email}</p>

      <form action={formAction} className="space-y-4">
        {fields.map(({ name, label, autoComplete }) => (
          <div key={name} className="space-y-2">
            <Label htmlFor={`profile-${name}`}>{label}</Label>
            <Input
              id={`profile-${name}`}
              name={name}
              autoComplete={autoComplete}
              value={values[name]}
              onChange={(event) => {
                const value = event.target.value;
                setValues((previous) => ({ ...previous, [name]: value }));
              }}
              readOnly={isPending}
              required
            />
          </div>
        ))}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save details"}
        </Button>

        {state.message && (
          <p role={state.success ? "status" : "alert"}>{state.message}</p>
        )}
      </form>
    </section>
  );
}
