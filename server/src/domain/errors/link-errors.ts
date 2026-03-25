import { z } from "zod";

export const LinkErrors = {
  ShortCodeAlreadyInUseError: (shortCode: string) => ({
    message: `The short code "${shortCode}" is already in use.`,
  }),
} as const;

export const LinkErrorSchema = z.object({
  message: z.string(),
});
