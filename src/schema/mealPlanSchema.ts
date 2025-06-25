// src/schema/mealPlanSchema.ts
import { z } from 'zod'

export const mealPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  imageUrl: z.string().url().nullable().optional(),
})

export type MealPlan = z.infer<typeof mealPlanSchema>
