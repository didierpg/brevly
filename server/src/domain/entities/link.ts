import { z } from "zod";

export const LinkSchema = z.object({
  originalUrl: z.url("Invalid URL format").default("https://example.com"),
  shortCode: z
    .string()
    .min(3, "Min 3 characters")
    .max(10, "Max 10 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores",
    ),
  accessCount: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
});

export type Link = z.infer<typeof LinkSchema>;
