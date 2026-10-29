"use client";

import { auth } from "@/lib/auth";
import { useForm } from "@tanstack/react-form";
import { updateUserSchema } from "@/lib/schemas/updateUser.schema";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import z from "zod";

export default function UpdateUserForm({
  user,
}: {
  user: Awaited<ReturnType<typeof auth.api.getUser>>;
}) {
  const form = useForm({
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "admin" : "user",
      banned: user.banned ?? false,
      banReason: user.banReason ?? "",
    },
    validators: {
      onSubmit: updateUserSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const { data } = await authClient.admin.updateUser({
          userId: value.id,
          data: {
            name: value.name,
            email: value.email,
            role: value.role,
            banned: value.banned,
            banReason: value.banReason,
          },
        });

        if (!data) {
          toast.add({
            type: "error",
            description: "can not be updated",
            priority: "high",
            positionerProps: {
              side: "bottom",
            },
          });
          return;
        }

        toast.add({
          type: "success",
          description: "Account updated",
        });
        formApi.reset(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return false;
        }
        throw error;
      }
    },
  });

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-4xl">Update User Details</h1>
        <div className="rounded-2xl border p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* name */}
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
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
              </form.Field>
              {/* email */}
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="email"
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
              </form.Field>
              <div className="flex items-center gap-5">
                {/* role */}
                <div className="flex-1 rounded-2xl border p-5">
                  <form.Field name="role">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field
                          orientation={"responsive"}
                          data-invalid={isInvalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="role">Role</FieldLabel>
                            {/* errors */}
                            {isInvalid && (
                              <FieldError
                                className="text-xs"
                                errors={field.state.meta.errors}
                              />
                            )}
                          </FieldContent>
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value ?? "");
                            }}
                          >
                            <SelectTrigger
                              id="role"
                              aria-invalid={isInvalid}
                              className="min-w-[150]"
                            >
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
                {/* banned */}
                <div className="flex-1 rounded-2xl border px-5 py-7">
                  <form.Field name="banned">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field
                          orientation="responsive"
                          data-invalid={isInvalid}
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="banned">Banned</FieldLabel>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </FieldContent>
                          <Switch
                            id="banned"
                            checked={field.state.value}
                            onCheckedChange={(checked) =>
                              field.handleChange(checked)
                            }
                          />
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
                {/* ban reason */}
              </div>
              <form.Field name="banReason">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Ban Reason</FieldLabel>
                      <Textarea
                        // rows={5}
                        id={field.name}
                        name={field.name}
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
              </form.Field>
            </FieldGroup>
            {/* submit button */}
            <Field orientation="horizontal" className="mt-8">
              <Button
                className="px-8 py-5"
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button className="px-8 py-5" type="submit">
                Submit
              </Button>
            </Field>
          </form>
        </div>
      </div>
    </>
  );
}
