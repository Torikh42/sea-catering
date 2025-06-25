"use client";

import React from "react";
import MealPlanCard from "./MealPlanCard";
import { MealPlan } from "@/schema/mealPlanSchema";

export default function MealPlanList({ plans }: { plans: MealPlan[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <MealPlanCard
          key={plan.id}
          plan={{
            name: plan.name,
            price: plan.price,
            description: plan.description,
            image: plan.imageUrl ?? undefined,
          }}
        />
      ))}
    </div>
  );
}
