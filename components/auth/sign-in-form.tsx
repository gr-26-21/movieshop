"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";

// schema
const formSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// component
export function SignInForm() {
  const router = useRouter();
  const myForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        toast.add({
          description: error.message ?? "failed to sign in",
          type: "error",
          priority: "high",
        });
        return;
      }

      //   show a success toast
      toast.add({
        description: "successfully signed in",
        type: "success",
      });

      const userRole = data?.user?.role;

      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }

      router.refresh();
    },
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Sign in</Button>} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            myForm.handleSubmit();
          }}
        >
          <FieldSet>
            {/* email */}
            <myForm.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="email"
                    />
                    {/* errors */}
                    {isInvalid && (
                      <FieldError
                        className="text-xs"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </myForm.Field>

            {/* password */}
            <myForm.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="current-password"
                    />
                    {/* errors */}
                    {isInvalid && (
                      <FieldError
                        className="text-xs"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </myForm.Field>

            <Field orientation="horizontal" className="mt-5">
              <myForm.Subscribe
                selector={(state) => [state.isSubmitting] as const}
              >
                {([isSubmitting]) => {
                  return (
                    <Button type="submit" disabled={isSubmitting}>
                      sign in
                      {isSubmitting && <Spinner />}
                    </Button>
                  );
                }}
              </myForm.Subscribe>
            </Field>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
