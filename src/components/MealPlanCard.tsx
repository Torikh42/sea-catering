"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { Eye, Clock, Users, Star, ChefHat, Utensils } from "lucide-react";

type SimplifiedMealPlan = {
  name: string;
  price: number;
  description: string;
  image?: string;
};

export default function MealPlanCard({ plan }: { plan: SimplifiedMealPlan }) {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <Card className="group relative transform overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Popular badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          Popular
        </div>

        <CardContent className="relative p-0">
          <div className="relative h-48 overflow-hidden">
            {plan.image ? (
              <Image
                src={plan.image}
                alt={plan.name}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                <ChefHat className="h-16 w-16 text-green-500 opacity-50" />
              </div>
            )}

            {/* Floating price tag */}
            <div className="absolute bottom-4 left-4 z-20 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="text-xs font-medium text-gray-500">
                Mulai dari
              </div>
              <div className="text-lg font-bold text-green-600">
                Rp{plan.price.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-400">/porsi</div>
            </div>
          </div>
        </CardContent>

        <CardHeader className="relative z-20 pb-2">
          <CardTitle className="line-clamp-2 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-green-600">
            {plan.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed text-gray-600">
            {plan.description}
          </CardDescription>
        </CardHeader>

        {/* Quick info */}
        <div className="flex items-center gap-4 px-6 pb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>30 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>1-2 orang</span>
          </div>
          <div className="flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            <span>Siap saji</span>
          </div>
        </div>

        <CardFooter className="relative z-20 pt-0">
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="group/btn h-12 w-full rounded-xl border-2 border-green-200 bg-white/80 font-semibold text-green-700 backdrop-blur-sm transition-all duration-300 hover:border-green-300 hover:bg-green-50"
          >
            <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
            Lihat Detail Menu
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-green-50 p-0">
          <div className="relative">
            {plan.image && (
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Floating title */}
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="mb-2 text-3xl font-bold">{plan.name}</h2>
                  <div className="flex items-center gap-2 text-green-200">
                    <ChefHat className="h-5 w-5" />
                    <span className="text-lg">Menu Premium</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8">
              <DialogHeader className="mb-6 space-y-4">
                {!plan.image && (
                  <DialogTitle className="flex items-center gap-3 text-3xl font-bold text-gray-800">
                    <ChefHat className="h-8 w-8 text-green-600" />
                    {plan.name}
                  </DialogTitle>
                )}
              </DialogHeader>

              <div className="space-y-6">
                {/* Price section */}
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-100">
                        Harga per porsi
                      </p>
                      <p className="text-3xl font-bold">
                        Rp{plan.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                      <Star className="h-8 w-8 fill-current text-yellow-300" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Utensils className="h-5 w-5 text-green-600" />
                    Deskripsi Menu
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <Clock className="mx-auto mb-2 h-6 w-6 text-yellow-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Cepat Saji
                    </p>
                    <p className="text-xs text-gray-500">30 menit</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                    <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                    <p className="text-sm font-medium text-gray-700">Porsi</p>
                    <p className="text-xs text-gray-500">1-2 orang</p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                    <ChefHat className="mx-auto mb-2 h-6 w-6 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Fresh</p>
                    <p className="text-xs text-gray-500">Bahan segar</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="h-14 w-full transform rounded-xl bg-gradient-to-r from-green-600 to-blue-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-green-700 hover:to-blue-700 hover:shadow-xl">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Pesan Sekarang
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
