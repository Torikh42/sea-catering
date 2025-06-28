"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createTestimonial } from "@/action/testimonial";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2, Star, MessageCircle, Sparkles, ChefHat } from "lucide-react";

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createTestimonial({ name, message, rating });

      if (result.success) {
        setName("");
        setMessage("");
        setRating(5);
        toast.success("Testimonial berhasil dikirim! 🎉");
      } else {
        toast.error(result.message || "Gagal mengirim testimonial.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Terjadi kesalahan tak terduga saat mengirim testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-all duration-200 hover:scale-110"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            disabled={loading}
          >
            <Star
              className={`h-8 w-8 transition-colors duration-200 ${
                star <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating} dari 5 bintang
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
        
        <Card className="max-w-lg mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-lg relative overflow-hidden">
          {/* Header with gradient background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-green-600 via-blue-600 to-green-700"></div>
          
          <CardHeader className="relative z-10 text-center pt-8 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 mx-auto">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Bagikan Pengalaman Anda
            </CardTitle>
            <p className="text-green-600 text-xl">
              Ceritakan kepada kami tentang pengalaman kuliner Anda
            </p>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8 pb-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  Nama Anda
                </Label>
                <Input
                  required
                  id="name"
                  placeholder="Siapa nama Anda?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="h-12 border-2 border-gray-200 focus:border-green-400 transition-colors duration-200 rounded-xl bg-white/50"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  Pesan Ulasan
                </Label>
                <Textarea
                  required
                  id="message"
                  placeholder="Ceritakan pengalaman kuliner menakjubkan Anda dengan catering kami..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  className="min-h-[120px] border-2 border-gray-200 focus:border-blue-400 transition-colors duration-200 rounded-xl bg-white/50 resize-none"
                />
              </div>

              {/* Star Rating */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Berikan Rating
                </Label>
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
                  <StarRating />
                  <p className="text-xs text-gray-500 text-center">
                    Klik bintang untuk memberikan penilaian makanan kami
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Mengirim testimonial...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <ChefHat className="h-5 w-5" />
                    <span>Kirim Testimonial</span>
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>

          {/* Bottom decorative element */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400"></div>
        </Card>
      </div>
    </div>
  );
}