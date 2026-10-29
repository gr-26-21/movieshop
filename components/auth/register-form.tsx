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
import { registerSchema } from "@/lib/schemas/auth.schema";

// component
export function RegisterForm() {
  const router = useRouter();
  const myForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        toast.add({
          description: error.message ?? "failed to register",
          type: "error",
          priority: "high",
        });
        return;
      }

      //   show a success toast
      toast.add({
        description: "successfully registered",
        type: "success",
      });

      //   redirect the user
      router.push("/user/dashboard");
      router.refresh();
    },
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">register</Button>} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create an account</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            myForm.handleSubmit();
          }}
        >
          <FieldSet>
            {/* name */}
            <myForm.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="off"
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
                      autoComplete="new-password"
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

            {/* confirm password */}
            <myForm.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder=""
                      autoComplete="new-password"
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
                      register
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
