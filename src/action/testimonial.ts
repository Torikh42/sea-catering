// action/testimonial.ts
"use server";
import prisma from "../../prisma/prisma"; // Adjust path if necessary
import { getUser } from "@/auth/server"; // Import getUser

// Hapus 'name' dari interface karena diambil dari user yang login
interface CreateTestimonialInput {
  message: string;
  rating: number;
}

interface CreateTestimonialInput {
  // `name` sudah tidak diperlukan dari client, jadi hapus saja.
  // message: string;
  // rating: number;
  message: string;
  rating: number;
}

export async function createTestimonial(data: CreateTestimonialInput) {
  try {
    // Dapatkan pengguna yang sedang login dari server
    const user = await getUser();

    // Pastikan user sudah login
    if (!user) {
      return {
        success: false,
        message: "Anda harus login untuk mengirim testimonial.",
      };
    }

    // Ambil nama dari objek user yang dikembalikan oleh getUser()
    const userName = user.name;

    // Validasi input
    if (!userName || userName.trim() === "") {
      // Ini adalah fallback jika nama di metadata user kosong
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

    // Buat testimonial baru di database
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: userName, // Gunakan nama dari user yang sudah terautentikasi
        message: data.message.trim(),
        rating: data.rating,
        userId: user.id, // Hubungkan testimonial dengan user ID
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
