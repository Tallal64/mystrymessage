import z from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // can be either username or email
  password: z.string(),
});
