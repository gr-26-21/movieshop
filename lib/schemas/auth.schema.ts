import z from "zod";

// register
export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });

//   sign-in
export const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
