import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "message must be atleast of 10 characters" })
    .max(300, { message: "300 characters limit reached" }),
});
