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

export default function TestimonialCarousel() {
  // Inisialisasi state testimonials dengan array kosong, bukan lagi dummy data
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk menunjukkan loading

  useEffect(() => {
    // Fungsi untuk mengambil testimoni dari server
    const fetchTestimonials = async () => {
      setIsLoading(true); // Set loading ke true saat mulai fetch
      const result = await getTestimonials();
      if (result.success && result.data) {
        setTestimonials(result.data);
      } else {
        toast.error(result.message || "Gagal memuat testimonial.");
        // Tidak lagi fallback ke dummy data, biarkan kosong jika gagal
        setTestimonials([]);
      }
      setIsLoading(false); // Set loading ke false setelah fetch selesai
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-10">
        Memuat testimonial...
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Belum ada testimonial yang tersedia.
      </div>
    );
  }

  return (
    // Tambahkan padding horizontal (px-4) untuk memberi ruang pada tombol di layar kecil
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Apa Kata Pelanggan Kami?
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: true, // Membuat carousel berputar
        }}
        plugins={[
          Autoplay({
            delay: 4000, // Durasi per slide (ms)
            stopOnInteraction: false, // Terus berputar meskipun ada interaksi
            stopOnMouseEnter: true, // Berhenti saat mouse di atas
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                    {/* Icon bintang besar, bisa dihapus jika tidak diperlukan */}
                    <Star className="h-8 w-8 text-yellow-400 fill-yellow-400 mb-3" />
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 line-clamp-4">
                      "{testimonial.message}"
                    </p>
                    <p className="font-semibold text-blue-600 mt-auto">
                      - {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(testimonial.createdAt).toLocaleDateString(
                        "id-ID", // Format tanggal ke bahasa Indonesia
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 sm:left-4" /> {/* Sesuaikan posisi jika perlu */}
        <CarouselNext className="right-2 sm:right-4" /> {/* Sesuaikan posisi jika perlu */}
      </Carousel>
    </div>
  );
}