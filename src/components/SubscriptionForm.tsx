"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card";

const mealPlans = [
  { name: "Diet Plan", price: 30000 },
  { name: "Protein Plan", price: 40000 },
  { name: "Royal Plan", price: 60000 },
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
  const [plan, setPlan] = useState(mealPlans[0].name);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const planPrice = mealPlans.find((p) => p.name === plan)?.price || 0;
    const price =
      planPrice *
      (selectedMealTypes.length || 0) *
      (selectedDays.length || 0) *
      4.3;
    setTotal(isNaN(price) ? 0 : price);
  }, [plan, selectedMealTypes, selectedDays]);

  const handleMealTypeChange = (type: string) => {
    setSelectedMealTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || selectedMealTypes.length === 0 || selectedDays.length === 0) {
      alert("Please fill all required fields.");
      return;
    }
    // TODO: Submit to backend
    alert("Subscription submitted!");
  };

  return (
    <Card className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Form Subscription</CardTitle>
          <CardDescription>
            Isi data di bawah untuk berlangganan meal plan SEA Catering.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">*Name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <Label htmlFor="phone">*Active Phone Number</Label>
            <Input
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              type="tel"
            />
          </div>
          <div>
            <Label htmlFor="plan">*Plan Selection</Label>
            <select
              id="plan"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              required
            >
              {mealPlans.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} – Rp{p.price.toLocaleString("id-ID")}/meal
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>*Meal Type</Label>
            <div className="flex gap-4 flex-wrap mt-1">
              {mealTypes.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMealTypes.includes(type)}
                    onChange={() => handleMealTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
            {selectedMealTypes.length === 0 && (
              <div className="text-xs text-red-500 mt-1">Pilih minimal satu meal type.</div>
            )}
          </div>
          <div>
            <Label>*Delivery Days</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            {selectedDays.length === 0 && (
              <div className="text-xs text-red-500 mt-1">Pilih minimal satu hari.</div>
            )}
          </div>
          <div>
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Tulis jika ada alergi"
            />
          </div>
          <div className="font-semibold text-green-700">
            Total Price: <span className="text-blue-600">Rp{total.toLocaleString("id-ID")}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </CardFooter>
      </form>
        </Card>
      );
    }