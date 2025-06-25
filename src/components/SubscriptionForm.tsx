"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea"; // Untuk pesan review yang lebih panjang
import { toast } from "sonner"; // Untuk notifikasi yang lebih baik
import { Star } from "lucide-react"; // Ikon bintang
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "./ui/card"; // Gunakan Card untuk form

import { createTestimonial } from "@/action/testimonial"; // Sesuaikan path jika berbeda

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0); // Mulai dari 0, pengguna memilih
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error states
  const [nameError, setNameError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [ratingError, setRatingError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Reset errors
    setNameError("");
    setMessageError("");
    setRatingError("");

    let isValid = true;
    if (!name.trim()) {
      setNameError("Nama pelanggan tidak boleh kosong.");
      isValid = false;
    }
    if (!message.trim()) {
      setMessageError("Pesan ulasan tidak boleh kosong.");
      isValid = false;
    }
    if (rating < 1 || rating > 5) {
      setRatingError("Mohon berikan rating bintang (1-5).");
      isValid = false;
    }

    if (!isValid) {
      toast.error("Mohon lengkapi semua bidang yang diperlukan.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createTestimonial({ name, message, rating });
      if (result.success) {
        toast.success(result.message);
        setName("");
        setMessage("");
        setRating(0); // Reset rating
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Client-side error submitting testimonial:", error);
      toast.error("Terjadi kesalahan saat mengirim testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-t-4 border-green-500 rounded-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-green-700">Berikan Testimonial Anda</CardTitle>
          <CardDescription className="text-md text-gray-600 mt-2">
            Bagikan pengalaman Anda bersama SEA Catering!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label htmlFor="name" className="font-semibold">Nama Pelanggan <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              placeholder="Nama Anda"
              className={`mt-1 ${nameError ? "border-red-500" : ""}`}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>
          <div>
            <Label htmlFor="message" className="font-semibold">Pesan Ulasan <span className="text-red-500">*</span></Label>
            <Textarea // Menggunakan Textarea untuk multi-baris input
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageError("");
              }}
              placeholder="Tulis ulasan Anda di sini..."
              rows={4} // Menentukan tinggi default
              className={`mt-1 ${messageError ? "border-red-500" : ""}`}
            />
            {messageError && <p className="text-red-500 text-sm mt-1">{messageError}</p>}
          </div>
          <div>
            <Label className="font-semibold">Rating Bintang <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-7 w-7 cursor-pointer transition-colors duration-200 ${
                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => {
                    setRating(star);
                    setRatingError("");
                  }}
                />
              ))}
            </div>
            {ratingError && <p className="text-red-500 text-sm mt-1">{ratingError}</p>}
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button type="submit" className="w-full py-2" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Testimonial"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}