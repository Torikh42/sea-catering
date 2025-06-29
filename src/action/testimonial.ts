"use server";
import prisma from "../../prisma/prisma";
import { getUser } from "@/auth/server";

interface CreateTestimonialInput {
  message: string;
  rating: number;
}

interface CreateTestimonialInput {
  rating: number;
}

export async function createTestimonial(data: CreateTestimonialInput) {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: "Anda harus login untuk mengirim testimonial.",
      };
    }

    const userName = user.name;

    if (!userName || userName.trim() === "") {
      return {
        success: false,
        message: "Nama Anda tidak ditemukan. Mohon perbarui profil Anda.",
      };
    }
    if (!data.message || data.message.trim() === "") {
      return { success: false, message: "Pesan ulasan diperlukan." };
    }
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, message: "Rating harus antara 1 dan 5." };
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: userName,
        message: data.message.trim(),
        rating: data.rating,
        userId: user.id,
      },
    });

    console.log("New testimonial created:", newTestimonial);
    return {
      success: true,
      message: "Terima kasih! Testimonial Anda berhasil dikirim.",
      testimonial: newTestimonial,
    };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return {
      success: false,
      message: "Gagal mengirim testimonial. Silakan coba lagi.",
    };
  }
}

export interface TestimonialData {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: Date;
  userId: string;
}

export async function getTestimonials(): Promise<{
  success: boolean;
  data?: TestimonialData[];
  message?: string;
}> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return { success: true, data: testimonials };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, message: "Gagal memuat testimonial." };
  }
}
