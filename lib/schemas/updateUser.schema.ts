import z from "zod";

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string(),
  role: z.enum(["admin", "user"]),
  banned: z.boolean(),
  banReason: z.string(),
});
