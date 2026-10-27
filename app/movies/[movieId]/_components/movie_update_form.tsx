"use client";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateMovie } from "@/actions/update-action"; 


interface MovieUpdateFormProps {
  movie: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    runtime: number;
    person: {
      id: number;
      name: string;
    } | null;
    releaseDate: Date;
    director: {
      id: number;
      name: string;
    } | null;
  };
}


const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  releaseDate: z
      .string().date("Invalid date").refine((val) => { const year = parseInt(val.split("-")[0], 10);
        const currentYear = new Date().getFullYear();
        return year >= 1000 && year <= currentYear;
      }, "Movie year must be between 1000 and the current year"),
  imageUrl: z.string().min(1, "Image URL is required"),
  stock: z.string().min(1, "Stock is required"),
  runtime: z.string().min(1, "Runtime is required"),
  person: z.string().min(1, "Person is required"),
  director: z.string().min(1, "Director is required"),
});

export function MovieUpdateForm({
  movie,
}: MovieUpdateFormProps) {
  const form = useForm({
    defaultValues: {
  title: movie.title,
  description: movie.description,
  price: String(movie.price),
  releaseDate: movie.releaseDate.toISOString().split("T")[0],
  imageUrl: movie.imageUrl,
  stock: String(movie.stock),
  runtime: String(movie.runtime),
  person: movie.person?.name ?? "",
  director: movie.director?.name ?? "",
},

    validators: {
      onSubmit: formSchema,
    },

onSubmit: async ({ value }) => {
  await updateMovie({
    id: movie.id,
    title: value.title,
    description: value.description,
    price: value.price,
    releaseDate: value.releaseDate,
    imageUrl: value.imageUrl,
    stock: value.stock,
    runtime: value.runtime,
    person: value.person,
    director: value.director,
  });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        {/* TITLE */}
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Title
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  placeholder="Movie title"
                />

                {isInvalid && (
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* PERSON */}
        <form.Field name="person">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Person
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  placeholder="Person name"
                />

                {isInvalid && (
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* DESCRIPTION */}
      <form.Field name="description">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>
          Description
        </FieldLabel>

        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) =>
            field.handleChange(event.target.value)
          }
          aria-invalid={isInvalid}
          placeholder="Movie description"
        />

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
      </form.Field>


        {/* RELEASE DATE */}
        <form.Field name="releaseDate">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>
          Release Date
        </FieldLabel>

          <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) =>
            field.handleChange(event.target.value)
          }
          aria-invalid={isInvalid}
          placeholder="Release date"
        />

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
        </form.Field>

        {/* DIRECTOR */}
        <form.Field name="director">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Director
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={isInvalid}
                  placeholder="Director name"
                />

                {isInvalid && (
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* PRICE */}
        <form.Field name="price">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>
          Price
        </FieldLabel>

        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) =>
            field.handleChange(event.target.value)
          }
          aria-invalid={isInvalid}
          placeholder="e.g., 19.99"
        />

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
        </form.Field>

        {/* STOCK */}
        <form.Field name="stock">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>
          Stock
        </FieldLabel>

        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) =>
            field.handleChange(event.target.value)
          }
          aria-invalid={isInvalid}
          placeholder="e.g., 10"
        />

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
        </form.Field>

        {/* RUNTIME */}
        <form.Field name="runtime">
  {(field) => {
    const isInvalid =
      field.state.meta.isTouched &&
      !field.state.meta.isValid;

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>
          Runtime
        </FieldLabel>

        <Input
          id={field.name}
          name={field.name}
          type="number"
          min={1}
          step={1}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) =>
            field.handleChange(event.target.value)
          }
          aria-invalid={isInvalid}
          placeholder="e.g., 120"
        />

        {isInvalid && (
          <FieldError errors={field.state.meta.errors} />
        )}
      </Field>
    );
  }}
        </form.Field>

        {/* IMAGE URL */}
        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched &&
              !field.state.meta.isValid;

              return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Image URL
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                      }
                  aria-invalid={isInvalid}
                  placeholder="https://example.com/movie.jpg"
                />

                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

      </FieldGroup>

      <Button type="submit">
        Update Movie
      </Button>
    </form>
  );
}