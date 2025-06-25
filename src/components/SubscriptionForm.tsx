// components/SubscriptionForm.tsx (atau di path yang sesuai)
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

// Definisi MealPlan type untuk type safety
interface MealPlan {
  name: string;
  price: number;
  description: string;
  details: string[];
}

// Data mealPlans diselaraskan dengan nama di seed.ts
const mealPlans: MealPlan[] = [
  {
    name: "Paket Diet Rendah Kalori",
    price: 30000,
    description: "Ideal untuk manajemen berat badan dengan kalori seimbang.",
    details: ["Rendah kalori", "Tinggi serat", "Makro seimbang"],
  },
  {
    name: "Paket Protein Maksimal",
    price: 40000,
    description: "Meningkatkan pertumbuhan otot dan pemulihan.",
    details: ["Tinggi protein", "Daging tanpa lemak", "Karbohidrat kompleks"],
  },
  {
    name: "Paket Royal Premium",
    price: 60000,
    description: "Bahan-bahan premium untuk nutrisi dan rasa terbaik.",
    details: ["Hidangan gourmet", "Bahan eksotis", "Disiapkan koki"],
  },
];

const mealTypes = ["Breakfast", "Lunch", "Dinner"];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SubscriptionForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // Inisialisasi dengan nama paket pertama
  const [plan, setPlan] = useState<string>(mealPlans[0].name);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition(); // Untuk Server Action loading state

  // Error states untuk required fields
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mealTypeError, setMealTypeError] = useState("");
  const [dayError, setDayError] = useState("");

  // Efek untuk menghitung total harga
  useEffect(() => {
    const selectedPlan = mealPlans.find((p) => p.name === plan);
    const planPrice = selectedPlan ? selectedPlan.price : 0;

    const price =
      planPrice *
      selectedMealTypes.length * // Number of Meal Types Selected
      selectedDays.length * // Number of Delivery Days Selected
      4.3; // Factor as per formula

    // Format harga ke 2 desimal (penting untuk perhitungan yang konsisten)
    setTotal(parseFloat(price.toFixed(2)));
  }, [plan, selectedMealTypes, selectedDays]);

  const handleMealTypeChange = (type: string) => {
    setSelectedMealTypes((prev) => {
      const newSelection = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      // Clear error saat ada pilihan
      setMealTypeError(newSelection.length === 0 ? "Pilih minimal satu tipe makanan." : "");
      return newSelection;
    });
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => {
      const newSelection = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      // Clear error saat ada pilihan
      setDayError(newSelection.length === 0 ? "Pilih minimal satu hari pengiriman." : "");
      return newSelection;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true; // Flag validasi

    // Reset errors
    setNameError("");
    setPhoneError("");
    setMealTypeError("");
    setDayError("");

    // Validasi Name
    if (!name.trim()) {
      setNameError("Nama lengkap diperlukan.");
      isValid = false;
    }
    // Validasi Phone Number
    if (!phone.trim()) {
      setPhoneError("Nomor telepon aktif diperlukan.");
      isValid = false;
    } else if (!/^\d+$/.test(phone.trim())) {
      setPhoneError("Nomor telepon harus berupa angka.");
      isValid = false;
    }
    // Validasi Meal Type
    if (selectedMealTypes.length === 0) {
      setMealTypeError("Pilih minimal satu tipe makanan.");
      isValid = false;
    }
    // Validasi Delivery Day
    if (selectedDays.length === 0) {
      setDayError("Pilih minimal satu hari pengiriman.");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Mohon lengkapi semua bidang yang diperlukan dengan benar.");
      return;
    }

    // Panggil Server Action
    startTransition(async () => {
      const result = await createSubscription({
        fullName: name,
        phone: phone,
        planName: plan,
        mealTypeNames: selectedMealTypes,
        deliveryDayNames: selectedDays,
        allergies: allergies.trim() === "" ? undefined : allergies, // Kirim undefined jika kosong
        totalPrice: total,
      });

      if (result.success) {
        toast.success(result.message);
        // Reset form setelah sukses
        setName('');
        setPhone('');
        setPlan(mealPlans[0].name); // Kembali ke plan default
        setSelectedMealTypes([]);
        setSelectedDays([]);
        setAllergies('');
        setTotal(0);
        // Opsional: Redirect atau tampilkan pesan sukses yang lebih besar
      } else {
        toast.error(result.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-blue-500 rounded-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-green-700">Form Langganan SEA Catering</CardTitle>
            <CardDescription className="text-md text-gray-600 mt-2">
              Isi data di bawah untuk memulai perjalanan makan sehat Anda bersama kami!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-base font-semibold">Nama Lengkap <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(""); // Clear error on change
                  }}
                  placeholder="Nama lengkap Anda"
                  className={`mt-1 ${nameError ? "border-red-500" : ""}`}
                  disabled={isPending}
                />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-base font-semibold">Nomor Telepon Aktif <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError(""); // Clear error on change
                  }}
                  placeholder="Contoh: 081234567890"
                  type="tel"
                  className={`mt-1 ${phoneError ? "border-red-500" : ""}`}
                  disabled={isPending}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
            </div>

            {/* Plan Selection Section */}
            <div>
              <Label className="text-base font-semibold block mb-2">Pilih Paket <span className="text-red-500">*</span></Label>
              <RadioGroup value={plan} onValueChange={setPlan} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealPlans.map((p) => (
                  <Label
                    key={p.name}
                    htmlFor={p.name}
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all duration-200 ease-in-out
                      ${plan === p.name ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300"}
                    `}
                  >
                    <RadioGroupItem value={p.name} id={p.name} className="sr-only" />
                    <div className="space-y-1 text-center">
                      <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.description}</p>
                      <ul className="text-xs text-gray-500 list-disc list-inside mt-2">
                        {p.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                      <span className="text-lg font-semibold text-green-600 mt-2 block">
                        Rp{p.price.toLocaleString("id-ID")}/meal
                      </span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Meal Type Section */}
            <div>
              <Label className="text-base font-semibold mb-2 block">Pilih Tipe Makanan <span className="text-red-500">*</span></Label>
              <div className="flex gap-4 flex-wrap mt-1">
                {mealTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`meal-type-${type}`}
                      checked={selectedMealTypes.includes(type)}
                      onCheckedChange={() => handleMealTypeChange(type)}
                      className="peer h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      disabled={isPending}
                    />
                    <Label
                      htmlFor={`meal-type-${type}`}
                      className="text-base font-medium peer-data-[state=checked]:text-blue-600 cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
              {mealTypeError && <p className="text-red-500 text-sm mt-1">{mealTypeError}</p>}
            </div>

            {/* Delivery Days Section */}
            <div>
              <Label className="text-base font-semibold mb-2 block">Pilih Hari Pengiriman <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 mt-1">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayChange(day)}
                      className="peer h-5 w-5 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      disabled={isPending}
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="text-base font-medium peer-data-[state=checked]:text-blue-600 cursor-pointer"
                    >
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
              {dayError && <p className="text-red-500 text-sm mt-1">{dayError}</p>}
            </div>

            {/* Allergies Section */}
            <div>
              <Label htmlFor="allergies" className="text-base font-semibold">Alergi / Batasan Diet (Opsional)</Label>
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
            <div className="text-right p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-100">
              <span className="text-lg text-gray-700 font-medium">Perkiraan Total Harga Langganan:</span>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                Rp{total.toLocaleString("id-ID")}
              </div>
              <p className="text-sm text-gray-500 mt-1">Harga dihitung berdasarkan pilihan Anda selama 4.3 minggu.</p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
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