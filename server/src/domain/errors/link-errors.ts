import { z } from "zod";

export const LinkErrors = {
  ShortCodeAlreadyInUse: (shortCode: string) => ({
    message: `The short code "${shortCode}" is already in use.`,
  }),
  LinkNotFoundByShortCode: (shortCode: string) => ({
    message: `No link found for short code "${shortCode}".`,
  }),
} as const;

export const LinkErrorSchema = z.object({
  message: z.string(),
});
