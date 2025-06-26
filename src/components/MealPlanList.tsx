"use client";

import React from "react";
import MealPlanCard from "./MealPlanCard";
import { MealPlan } from "@/schema/mealPlanSchema";
import { ChefHat, Sparkles } from "lucide-react";

export default function MealPlanList({ plans }: { plans: MealPlan[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow-lg">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-800 md:text-5xl">
            Menu Spesial Kami
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Nikmati berbagai pilihan menu lezat yang disiapkan dengan
            bahan-bahan segar terbaik oleh chef berpengalaman kami
          </p>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-8 -left-8 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-10 blur-2xl"></div>
          <div className="absolute -right-8 -bottom-8 h-40 w-40 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-green-400 opacity-10 blur-2xl delay-1000"></div>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MealPlanCard
                  plan={{
                    name: plan.name,
                    price: plan.price,
                    description: plan.description,
                    image: plan.imageUrl ?? undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {plans.length === 0 && (
          <div className="py-20 text-center">
            <ChefHat className="mx-auto mb-6 h-24 w-24 text-gray-300" />
            <h3 className="mb-2 text-2xl font-semibold text-gray-500">
              Belum Ada Menu
            </h3>
            <p className="text-gray-400">
              Menu spesial sedang dalam persiapan. Silakan kembali lagi nanti!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
