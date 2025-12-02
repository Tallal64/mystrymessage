import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be atleast 2 characters")
  .max(20, "20 characters is limit");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.email({ message: "invalid email address" }),
  password: z
    .string()
    .min(4, { message: "password must be greater than 4 characters" }),
});
