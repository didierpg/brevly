import { z } from "zod";

export const LinkSchema = z.object({
  id: z.uuid(),
  createdAt: z.date().default(() => new Date()),
});

export type Link = z.infer<typeof LinkSchema>;
