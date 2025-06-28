// components/SubscriptionForm.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { toast } from "sonner";
import { createSubscription } from "@/action/subscription"; // Pastikan path ini benar!
import { Loader2 } from "lucide-react";

interface MealPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
}

interface MealType {
  id: string;
  name: string;
}

interface DeliveryDay {
  id: string;
  name: string;
}

// Tambahkan props untuk komponen ini
interface SubscriptionFormProps {
  mealPlans: MealPlan[];
  mealTypes: MealType[];
  deliveryDays: DeliveryDay[];
}

// Terima props di sini
export default function SubscriptionForm({
  mealPlans,
  mealTypes,
  deliveryDays,
}: SubscriptionFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [plan, setPlan] = useState<string>(mealPlans[0]?.name || "");
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mealTypeError, setMealTypeError] = useState("");
  const [dayError, setDayError] = useState("");

  useEffect(() => {
    const selectedPlan = mealPlans.find((p) => p.name === plan);
    const planPrice = selectedPlan ? selectedPlan.price : 0;

    const price =
      planPrice * selectedMealTypes.length * selectedDays.length * 4.3;

    setTotal(parseFloat(price.toFixed(2)));
  }, [plan, selectedMealTypes, selectedDays, mealPlans]); // Tambahkan mealPlans ke dependency array

  const handleMealTypeChange = (type: string) => {
    setSelectedMealTypes((prev) => {
      const newSelection = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      setMealTypeError(
        newSelection.length === 0 ? "Pilih minimal satu tipe makanan." : "",
      );
      return newSelection;
    });
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => {
      const newSelection = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      setDayError(
        newSelection.length === 0 ? "Pilih minimal satu hari pengiriman." : "",
      );
      return newSelection;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    setNameError("");
    setPhoneError("");
    setMealTypeError("");
    setDayError("");

    if (!name.trim()) {
      setNameError("Nama lengkap diperlukan.");
      isValid = false;
    }
    if (!phone.trim()) {
      setPhoneError("Nomor telepon aktif diperlukan.");
      isValid = false;
    } else if (!/^\d+$/.test(phone.trim())) {
      setPhoneError("Nomor telepon harus berupa angka.");
      isValid = false;
    }
    if (selectedMealTypes.length === 0) {
      setMealTypeError("Pilih minimal satu tipe makanan.");
      isValid = false;
    }
    if (selectedDays.length === 0) {
      setDayError("Pilih minimal satu hari pengiriman.");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Mohon lengkapi semua bidang yang diperlukan dengan benar.");
      return;
    }

    startTransition(async () => {
      const result = await createSubscription({
        fullName: name,
        phone: phone,
        planName: plan,
        mealTypeNames: selectedMealTypes,
        deliveryDayNames: selectedDays,
        allergies: allergies.trim() === "" ? undefined : allergies,
        totalPrice: total,
      });

      if (result.success) {
        toast.success(result.message);
        setName("");
        setPhone("");
        setPlan(mealPlans[0]?.name || "");
        setSelectedMealTypes([]);
        setSelectedDays([]);
        setAllergies("");
        setTotal(0);
      } else {
        toast.error(result.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-2xl rounded-lg border-t-4 border-blue-500 shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-3xl font-bold text-green-700">
              Form Langganan SEA Catering
            </CardTitle>
            <CardDescription className="text-md mt-2 text-gray-600">
              Isi data di bawah untuk memulai perjalanan makan sehat Anda
              bersama kami!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-base font-semibold">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                  placeholder="Nama lengkap Anda"
                  className={`mt-1 ${nameError ? "border-red-500" : ""}`}
                  disabled={isPending}
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-500">{nameError}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-base font-semibold">
                  Nomor Telepon Aktif <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError("");
                  }}
                  placeholder="Contoh: 081234567890"
                  type="tel"
                  className={`mt-1 ${phoneError ? "border-red-500" : ""}`}
                  disabled={isPending}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-500">{phoneError}</p>
                )}
              </div>
            </div>

            {/* Plan Selection Section */}
            <div>
              <Label className="mb-2 block text-base font-semibold">
                Pilih Paket <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={plan}
                onValueChange={setPlan}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                {mealPlans.map((p) => (
                  <Label
                    key={p.id} // Gunakan ID dari database sebagai key
                    htmlFor={p.id}
                    className={`flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4 transition-all duration-200 ease-in-out ${plan === p.name ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300"} `}
                  >
                    <RadioGroupItem
                      value={p.name}
                      id={p.id}
                      className="sr-only"
                    />
                    <div className="space-y-1 text-center">
                      <h3 className="text-lg font-bold text-gray-800">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-500">{p.description}</p>
                      <span className="mt-2 block text-lg font-semibold text-green-600">
                        Rp{p.price.toLocaleString("id-ID")}/meal
                      </span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Meal Type Section */}
            <div>
              <Label className="mb-2 block text-base font-semibold">
                Pilih Tipe Makanan <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 flex flex-wrap gap-4">
                {mealTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`meal-type-${type.id}`}
                      checked={selectedMealTypes.includes(type.name)}
                      onCheckedChange={() => handleMealTypeChange(type.name)}
                      className="peer h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      disabled={isPending}
                    />
                    <Label
                      htmlFor={`meal-type-${type.id}`}
                      className="cursor-pointer text-base font-medium peer-data-[state=checked]:text-blue-600"
                    >
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
              {mealTypeError && (
                <p className="mt-1 text-sm text-red-500">{mealTypeError}</p>
              )}
            </div>

            {/* Delivery Days Section */}
            <div>
              <Label className="mb-2 block text-base font-semibold">
                Pilih Hari Pengiriman <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
                {deliveryDays.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={selectedDays.includes(day.name)}
                      onCheckedChange={() => handleDayChange(day.name)}
                      className="peer h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      disabled={isPending}
                    />
                    <Label
                      htmlFor={`day-${day.id}`}
                      className="cursor-pointer text-base font-medium peer-data-[state=checked]:text-blue-600"
                    >
                      {day.name}
                    </Label>
                  </div>
                ))}
              </div>
              {dayError && (
                <p className="mt-1 text-sm text-red-500">{dayError}</p>
              )}
            </div>

            {/* Allergies Section */}
            <div>
              <Label htmlFor="allergies" className="text-base font-semibold">
                Alergi / Batasan Diet (Opsional)
              </Label>
              <Input
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Contoh: kacang, gluten, vegan"
                className="mt-1"
                disabled={isPending}
              />
            </div>

            {/* Total Price Display */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-right shadow-inner">
              <span className="text-lg font-medium text-gray-700">
                Perkiraan Total Harga Langganan:
              </span>
              <div className="mt-2 text-3xl font-bold text-blue-600">
                Rp{total.toLocaleString("id-ID")}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Harga dihitung berdasarkan pilihan Anda selama 4.3 minggu.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 py-3 text-lg font-semibold transition-colors duration-200 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...
                </>
              ) : (
                "Langganan Sekarang"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
