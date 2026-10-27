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
import { createMovie } from "@/actions/create-action";
import { Textarea } from "@/components/ui/textarea";
import { startTransition } from "react";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title has to be at least 3 characters")
    .max(75, "Title must be at most 75 characters"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  releaseDate: z
      .string().date("Invalid date").refine((val) => { const year = parseInt(val.split("-")[0], 10);
        const currentYear = new Date().getFullYear();
        return year >= 1000 && year <= currentYear;
      }, "Movie year must be between 1000 and the current year"),
  imageUrl: z.string(),
  stock: z.number().min(1, "Stock is required"),
  runtime: z.number().min(1, "Runtime is required"),
});

export function MovieCreateForm() {
  const form = useForm({
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
      startTransition(async () => {
        const success = await createMovie(value);
        console.log("SUCCESS:", success);
      });
    },
  });

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="price">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="releaseDate">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Release Date</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* <form.Field name="director">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Director</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="person">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid

            // The error occurs because `"actor"` is not included in the allowed values for the `name` property.
            // The type definition only permits the specified fields, such as `person` or `director`.
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Credits</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field> */}

        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid

            // Change input to TextArea if Input to little
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(ev.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="stock">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="runtime">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            // isTouched = has user interacted with it?
            // isValid  (!in this case) is not valid
            // these combined means thats its invalid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Runtime</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(ev) => field.handleChange(Number(ev.target.value))}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Field orientation="horizontal">
          <Button
            type="button"
            variant="destructive"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
// const form = useForm({
//   defaultValues: {
//     title: "",
//     description: "",
//     price: "",
//     releaseDate: "",
//     imageUrl: "",
//     stock: "",
//     runtime: "",
//     person: "",
//     director: "",
//   },

//   validators: {
//     onSubmit: formSchema,
//   },

//   onSubmit: async ({ value }) => {
//     await createMovie({
//       title: value.title,
//       description: value.description,
//       price: value.price,
//       releaseDate: value.releaseDate,
//       imageUrl: value.imageUrl,
//       stock: value.stock,
//       runtime: value.runtime,
//       person: value.person,
//       director: value.director,
//     });
//     },
//   });

//   return (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         form.handleSubmit();
//       }}
//       className="space-y-4"
//     >
//       <FieldGroup>
//         {/* TITLE */}
//         <form.Field name="title">
//           {(field) => {
//             const isInvalid =
//               field.state.meta.isTouched &&
//               !field.state.meta.isValid;

//             return (
//               <Field data-invalid={isInvalid}>
//                 <FieldLabel htmlFor={field.name}>
//                   Title
//                 </FieldLabel>

//                 <Input
//                   id={field.name}
//                   name={field.name}
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   onChange={(event) =>
//                     field.handleChange(event.target.value)
//                   }
//                   aria-invalid={isInvalid}
//                   placeholder="Movie title"
//                 />

//                 {isInvalid && (
//                   <FieldError
//                     errors={field.state.meta.errors}
//                   />
//                 )}
//               </Field>
//             );
//           }}
//         </form.Field>

//         {/* PERSON */}
//         <form.Field name="person">
//           {(field) => {
//             const isInvalid =
//               field.state.meta.isTouched &&
//               !field.state.meta.isValid;

//             return (
//               <Field data-invalid={isInvalid}>
//                 <FieldLabel htmlFor={field.name}>
//                   Person
//                 </FieldLabel>

//                 <Input
//                   id={field.name}
//                   name={field.name}
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   onChange={(event) =>
//                     field.handleChange(event.target.value)
//                   }
//                   aria-invalid={isInvalid}
//                   placeholder="Person name"
//                 />

//                 {isInvalid && (
//                   <FieldError
//                     errors={field.state.meta.errors}
//                   />
//                 )}
//               </Field>
//             );
//           }}
//         </form.Field>

//         {/* PUBLICATION DATE */}
//         <form.Field name="releaseDate">
//   {(field) => {
//     const isInvalid =
//       field.state.meta.isTouched &&
//       !field.state.meta.isValid;

//     return (
//       <Field data-invalid={isInvalid}>
//         <FieldLabel htmlFor={field.name}>
//           Release Date
//         </FieldLabel>

//         <Input
//           id={field.name}
//           name={field.name}
//           value={field.state.value}
//           type="date"
//           onBlur={field.handleBlur}
//           onChange={(event) => field.handleChange(event.target.value)}
//           aria-invalid={isInvalid}
//           autoComplete="off"
//         />

//         {isInvalid && (
//           <FieldError
//             className="text-xs"
//             errors={field.state.meta.errors}
//           />
//         )}
//       </Field>
//     );
//   }}
// </form.Field>

//         {/* DIRECTOR */}
//         <form.Field name="director">
//           {(field) => {
//             const isInvalid =
//               field.state.meta.isTouched &&
//               !field.state.meta.isValid;

//             return (
//               <Field data-invalid={isInvalid}>
//                 <FieldLabel htmlFor={field.name}>
//                   Director
//                 </FieldLabel>

//                 <Input
//                   id={field.name}
//                   name={field.name}
//                   value={field.state.value}
//                   onBlur={field.handleBlur}
//                   onChange={(event) =>
//                     field.handleChange(event.target.value)
//                   }
//                   aria-invalid={isInvalid}
//                   placeholder="Director name"
//                 />

//                 {isInvalid && (
//                   <FieldError
//                     errors={field.state.meta.errors}
//                   />
//                 )}
//               </Field>
//             );
//           }}
//         </form.Field>
//       </FieldGroup>

//       <Button type="submit">
//         Create Movie
//       </Button>
//     </form>
//   );
// }
