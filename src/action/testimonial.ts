"use server";
import { PrismaClient } from '@prisma/client'; // Pastikan import PrismaClient
// Atau jika Anda memiliki instance prisma yang diekspor dari tempat lain:
// import { prisma } from "../../prisma/prisma"; // Adjust path if necessary

const prisma = new PrismaClient(); // Inisialisasi PrismaClient jika belum

interface CreateTestimonialInput {
  name: string;
  message: string;
  rating: number;
}

export async function createTestimonial(data: CreateTestimonialInput) {
  try {
    // Server-side validation
    if (!data.name || data.name.trim() === '') {
      return { success: false, message: "Nama pelanggan diperlukan." };
    }
    if (!data.message || data.message.trim() === '') {
      return { success: false, message: "Pesan ulasan diperlukan." };
    }
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, message: "Rating harus antara 1 dan 5." };
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: data.name.trim(),
        message: data.message.trim(),
        rating: data.rating,
      },
    });

    console.log("New testimonial created:", newTestimonial);
    return { success: true, message: "Terima kasih! Testimonial Anda berhasil dikirim.", testimonial: newTestimonial };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, message: "Gagal mengirim testimonial. Silakan coba lagi." };
  }
}

// Interface untuk testimonial yang diambil dari DB (opsional, untuk type safety)
export interface TestimonialData {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: Date;
}

export async function getTestimonials(): Promise<{ success: boolean, data?: TestimonialData[], message?: string }> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Mengambil 10 testimoni terbaru
    });
    return { success: true, data: testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, message: "Gagal memuat testimonial." };
  }
}