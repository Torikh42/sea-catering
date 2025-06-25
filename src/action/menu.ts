"use server";
import { mealPlanSchema } from "@/schema/mealPlanSchema";
import { prisma } from "../../prisma/prisma";

export const getAllMealPlans = async () => {
  const mealPlans = await prisma.mealPlan.findMany({
    orderBy: { name: "asc" },
  });


  return mealPlans.map((item) => mealPlanSchema.parse(item));
};
