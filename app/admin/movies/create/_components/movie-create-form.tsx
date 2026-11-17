"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createMovie } from "@/app/admin/movies/create/_components/create-action";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  releaseDate: z
    .string()
    .date("Invalid date")
    .refine((val) => {
      const year = parseInt(val.split("-")[0], 10);
      const currentYear = new Date().getFullYear();
      return year >= 1000 && year <= currentYear;
    }, "Movie year must be between 1000 and the current year"),
  imageUrl: z.union([
    z.literal(""),
    z.string().url("Please provide a valid image URL"),
  ]),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(1, "Stock is required"),
  runtime: z
    .number()
    .int("Runtime must be a whole number")
    .min(1, "Runtime is required"),
});

// Creates a MovieInput type and PendingMovie type that will be used later to avoid defining properties twice
type MovieInput = z.infer<typeof formSchema>;
type PendingMovie = {
  id: string;
  movie: MovieInput;
};

export function MovieCreateForm() {
  const router = useRouter();

  const [pendingMovies, setPendingMovies] = useState<PendingMovie[]>([]); // store movies that been added to the form but not saved in DB, where the PendingMovies list starts empty
  const [isSubmitting, setIsSubmitting] = useState(false); // prevents submitting multiple requests to the pending list when false
  const [savingMovieId, setSavingMovieId] = useState<string | null>(null); // keep track of which pending movie is being saved to DB

  const form = useForm({
    // create a custom form
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      releaseDate: "",
      imageUrl: "",
      stock: 0,
      runtime: 0,
    },
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        setPendingMovies((prev) => [
          // update pendingMovies state
          ...prev, // copies all existing movies into the ...new array instead of replacing the whole list with a new movie
          {
            id: crypto.randomUUID(), // create a unique ID for the pending movie to identify a pending movie, remove or track a movie that is currently being saved
            movie: value, // value stores the information entered into the form that stores it into the movie property
          },
        ]);
        form.reset();

        toast.add({
          title: "Movie added",
          description: `${value.title} has been added to your pending movies.`,
          type: "success",
        });

      } finally {
        setIsSubmitting(false);
      }
    },
  });

  async function handleKeep(pendingMovie: PendingMovie) {
    if (savingMovieId !== null) return; // prevents starting another save at the same time

    setSavingMovieId(pendingMovie.id);

    try {
      const movieId = await createMovie(pendingMovie.movie); // false argument
      // tells server action not to redirect after saving
      if (!movieId) {
        toast.add({
          title: "Could not save movie",
          description: "Please check the movie information and try again.",
          type: "error",
        });

        return;
      }

      setPendingMovies((prev) =>
        prev.filter((item) => item.id !== pendingMovie.id)
      );

      toast.add({
        title: "Movie saved",
        description: `${pendingMovie.movie.title} was successfully saved.`,
        type: "success",
      });

      router.refresh(); // refresh current route's server-rendered data to show the latest data and the new movies that have been saved to the database (Next.js)
    } catch (error) {
      console.error("Failed to save movie:", error); // prints error in the browser console

      toast.add({
        title: "Something went wrong",
        description: "Could not save the movie. Please try again.",
        type: "error",
      });
    } finally {
      // // when operation finishes (succeds or fails), finally resets setSavingMovieId(pendingMovie.id); to null
      setSavingMovieId(null);
    }
  }

  function handleDiscard(movieId: string) {
    setPendingMovies((prev) => prev.filter((movie) => movie.id !== movieId)); // updates pendingMovies state of the current list of pending movies (prev) to create an updated list
    // checks wheter its ID is different from ID that should be removed from pendingMovies (without affecting other movies)

    toast.add({
      title: "Movie discarded",
      description: "The movie was removed from your pending list.",
      type: "info",
    });
  }
  return (
    <div className="space-y-8">
      {/* Pending movies */}
      {pendingMovies.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Pending Movies</h2>

            <p className="text-sm text-muted-foreground">
              Choose which movies you want to save.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingMovies.map((pendingMovie) => (
              <div
                key={pendingMovie.id}
                className="space-y-3 rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-semibold">{pendingMovie.movie.title}</h3>

                  <p className="text-sm text-muted-foreground">
                    Price: {pendingMovie.movie.price}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Release date: {pendingMovie.movie.releaseDate}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Stock: {pendingMovie.movie.stock}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1"
                    disabled={savingMovieId !== null}
                    onClick={() => handleKeep(pendingMovie)}
                  >
                    {savingMovieId === pendingMovie.id ? "Saving..." : "Keep"}
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    disabled={savingMovieId !== null}
                    onClick={() => handleDiscard(pendingMovie.id)}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create movie form */}
      <form
        onSubmit={(ev) => {
          ev.preventDefault(); // prevent default form submission (which can reload or navigate current page)
          ev.stopPropagation(); // prevents parent elements from receiving this submit (from bubbling up to parent elements)
          form.handleSubmit(); // validates, form values using schema, check if valid, run the configured onSubmit if validation succeeds
        }}
      >
        <FieldGroup>
          {/* Title */}
          <form.Field name="title">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  placeholder="Movie title"
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Description */}
          <form.Field name="description">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  placeholder="Movie description"
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Price */}
          <form.Field name="price">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Release date */}
          <form.Field name="releaseDate">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Release date</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Image URL */}
          <form.Field name="imageUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Image URL (optional)
                </FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  placeholder="https://example.com/image.jpg"
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Stock */}
          <form.Field name="stock">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Stock</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Runtime */}
          <form.Field name="runtime">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Runtime (minutes)</FieldLabel>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                />

                {field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                )}
              </Field>
            )}
          </form.Field>

          {/* Form buttons */}
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="destructive"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Movie"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
