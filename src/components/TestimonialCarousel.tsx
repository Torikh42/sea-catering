"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getTestimonials, TestimonialData } from "@/action/testimonial"; // Import getTestimonials dan tipenya
import { toast } from "sonner";
import Autoplay from "embla-carousel-autoplay";

// Dummy data untuk development sebelum fetch dari DB
const dummyTestimonials: TestimonialData[] = [
  {
    id: "1",
    name: "Andi Wijaya",
    message: "Makanan sangat enak dan sesuai diet saya. Pengiriman selalu tepat waktu!",
    rating: 5,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Budi Santoso",
    message: "Protein Plan-nya luar biasa! Otot makin terbentuk. Sangat direkomendasikan.",
    rating: 4,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Citra Dewi",
    message: "Pelayanan pelanggan responsif, menu variatif, dan nutrisi lengkap. Terbaik!",
    rating: 5,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Dewi Lestari",
    message: "Sudah langganan Royal Plan. Rasanya seperti makan di restoran bintang 5 setiap hari.",
    rating: 5,
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Eko Prasetyo",
    message: "Awalnya ragu, tapi setelah coba Diet Plan, berat badan turun dan merasa lebih sehat.",
    rating: 4,
    createdAt: new Date(),
  },
];

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(dummyTestimonials); // Gunakan dummy dulu

  useEffect(() => {
    // Fungsi untuk mengambil testimoni dari server
    const fetchTestimonials = async () => {
      const result = await getTestimonials();
      if (result.success && result.data) {
        setTestimonials(result.data);
      } else {
        toast.error(result.message || "Gagal memuat testimonial.");
        // Fallback to dummy data if fetching fails
        setTestimonials(dummyTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) {
    return (
        <div className="text-center text-gray-500 py-10">
            Belum ada testimonial yang tersedia.
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Apa Kata Pelanggan Kami?</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true, // Membuat carousel berputar
        }}
        plugins={[
          Autoplay({ // Tambahkan plugin auto-scroll
            delay: 4000, // Durasi per slide (ms)
            stopOnInteraction: false, // Terus berputar meskipun ada interaksi
            stopOnMouseEnter: true, // Berhenti saat mouse di atas
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                    <Star
                      className="h-8 w-8 text-yellow-400 fill-yellow-400 mb-3"
                    />
                    <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${
                                    i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 line-clamp-4">"{testimonial.message}"</p>
                    <p className="font-semibold text-blue-600 mt-auto">- {testimonial.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(testimonial.createdAt).toLocaleDateString("id-ID", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}