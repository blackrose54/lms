import { z } from "zod";

export const newCourse = z.object({
  id:z.string().optional(),
  title: z.string().min(1,{message:"Course Title is required!"}),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
});

export type newCourse = z.infer<typeof newCourse>