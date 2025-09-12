import { z } from "zod";

export const Insight = z.object({
  id: z.number().int().min(0),
  brandId: z.number().int().min(0),
  date: z.date(),
  text: z.string(),
  optimistic: z.boolean().optional(),
});

export type Insight = z.infer<typeof Insight>;

export const NewInsight = z.object({
  brandId: z.number().int().min(0),
  text: z.string(),
});

export type NewInsight = z.infer<typeof NewInsight>;
