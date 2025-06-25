"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox"; // Assuming you have a Checkbox component (ShadCN/UI)
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"; // For radio buttons
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";
import { toast } from "sonner"; // For better feedback than alert()

// Define MealPlan type for better type safety
interface MealPlan {
  name: string;
  price: number;
  description: string; // Added description for better UI display
  details: string[]; // Added details for more info
}

const mealPlans: MealPlan[] = [
  {
    name: "Diet Plan",
    price: 30000,
    description: "Ideal for weight management with balanced calories.",
    details: ["Low calorie", "High fiber", "Balanced macros"],
  },
  {
    name: "Protein Plan",
    price: 40000,
    description: "Boost your muscle growth and recovery.",
    details: ["High protein", "Lean meats", "Complex carbs"],
  },
  {
    name: "Royal Plan",
    price: 60000,
    description: "Premium ingredients for ultimate nutrition and taste.",
    details: ["Gourmet meals", "Exotic ingredients", "Chef-curated"],
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
  const [plan, setPlan] = useState<string>(mealPlans[0].name); // Initialize with first plan name
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [total, setTotal] = useState(0);

  // Error states for required fields
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mealTypeError, setMealTypeError] = useState("");
  const [dayError, setDayError] = useState("");

  useEffect(() => {
    const selectedPlan = mealPlans.find((p) => p.name === plan);
    const planPrice = selectedPlan ? selectedPlan.price : 0;

    // Calculate total price. Ensure selectedMealTypes.length and selectedDays.length are not 0 to avoid multiplication by zero if no selection
    const price =
      planPrice *
      (selectedMealTypes.length > 0 ? selectedMealTypes.length : 0) *
      (selectedDays.length > 0 ? selectedDays.length : 0) *
      4.3;

    // Format the total price to 2 decimal places if it's not an integer, otherwise keep it as integer for better currency representation
    setTotal(parseFloat(price.toFixed(2))); // Use toFixed for consistent decimal handling
  }, [plan, selectedMealTypes, selectedDays]);

  const handleMealTypeChange = (type: string) => {
    setSelectedMealTypes((prev) => {
      const newSelection = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      setMealTypeError(newSelection.length === 0 ? "Pilih minimal satu meal type." : "");
      return newSelection;
    });
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => {
      const newSelection = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      setDayError(newSelection.length === 0 ? "Pilih minimal satu hari." : "");
      return newSelection;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
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
    } else if (!/^\d+$/.test(phone.trim())) { // Basic phone number validation (digits only)
        setPhoneError("Nomor telepon harus berupa angka.");
        isValid = false;
    }
    if (selectedMealTypes.length === 0) {
      setMealTypeError("Pilih minimal satu meal type.");
      isValid = false;
    }
    if (selectedDays.length === 0) {
      setDayError("Pilih minimal satu hari pengiriman.");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Mohon lengkapi semua bidang yang diperlukan.");
      return;
    }

    // TODO: Submit to backend
    // For now, simulate submission
    console.log({
      name,
      phone,
      plan,
      selectedMealTypes,
      selectedDays,
      allergies,
      total,
    });
    toast.success("Langganan Anda telah berhasil diajukan!");
    // You might want to reset the form here
    setName('');
    setPhone('');
    setPlan(mealPlans[0].name);
    setSelectedMealTypes([]);
    setSelectedDays([]);
    setAllergies('');
    setTotal(0);
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
            >
              Langganan Sekarang
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}