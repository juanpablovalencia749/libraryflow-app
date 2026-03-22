import * as z from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear()),
  status: z.enum(["AVAILABLE", "RESERVED", "LOANED"]),
});

export type BookFormValues = z.infer<typeof bookSchema>;
