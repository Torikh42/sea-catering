"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

type MealPlan = {
  name: string;
  price: number;
  description: string;
  image?: string;
  details?: string;
};

export default function MealPlanCard({
  plan,
  onSeeMore,
}: {
  plan: MealPlan;
  onSeeMore: () => void;
}) {
  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          Rp{plan.price.toLocaleString("id-ID")}/meal
        </CardDescription>
      </CardHeader>
      <CardContent>
        {plan.image && (
          <Image
            src={plan.image}
            alt={plan.name}
            className="mb-2 h-32 w-full rounded object-cover"
            width={200}
            height={200}
          />
        )}
        <p className="text-gray-600">{plan.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onSeeMore}>
          See More Details
        </Button>
      </CardFooter>
    </Card>
  );
}
