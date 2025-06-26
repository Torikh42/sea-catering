// actions/subscription.ts
"use server";

import prisma from "../../prisma/prisma";
// GANTI impor ini dengan helper Anda
import { createClient } from "@/auth/server"; 

export interface CreateSubscriptionInput {
    fullName: string;
    phone: string;
    planName: string;
    mealTypeNames: string[];
    deliveryDayNames: string[];
    allergies?: string;
    totalPrice: number;
}

/**
 * Creates a new subscription in the database for the authenticated user.
 * It validates the input and fetches the data from the database.
 */
export async function createSubscription(data: CreateSubscriptionInput) {
    try {
        // --- 1. Mendapatkan User ID dari sesi Supabase (REVISI) ---
        // Panggil helper createClient() yang sudah dibuat di server.ts.
        // Ini akan menangani cookies() dengan benar.
        const supabase = await createClient(); 
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error("Authentication Error:", sessionError?.message || "Auth session missing!");
            return {
                success: false,
                message: "Anda harus login untuk membuat langganan.",
            };
        }

        const userId = session.user.id;
        console.log(`Authenticated user ID from session: ${userId}`);

        // --- 2. Validasi Dasar Data Input --- (Kode ini sudah benar)
        if (
            !data.fullName ||
            !data.phone ||
            data.mealTypeNames.length === 0 ||
            data.deliveryDayNames.length === 0 ||
            data.totalPrice <= 0
        ) {
            return {
                success: false,
                message: "Semua bidang bertanda (*) harus diisi.",
            };
        }
        if (!/^\d+$/.test(data.phone)) {
            return {
                success: false,
                message: "Nomor telepon harus berisi hanya angka.",
            };
        }

        // --- 3. Dapatkan ID dari Nama Plan, Meal Types, dan Delivery Days --- (Sudah benar)
        const selectedMealPlan = await prisma.mealPlan.findFirst({
            where: { name: data.planName },
        });
        if (!selectedMealPlan) {
            return { success: false, message: "Paket makanan tidak valid." };
        }

        const mealTypesInDb = await prisma.mealType.findMany({
            where: { name: { in: data.mealTypeNames } },
        });
        if (mealTypesInDb.length !== data.mealTypeNames.length) {
            return {
                success: false,
                message: "Satu atau lebih tipe makanan tidak valid.",
            };
        }

        const deliveryDaysInDb = await prisma.deliveryDay.findMany({
            where: { name: { in: data.deliveryDayNames } },
        });
        if (deliveryDaysInDb.length !== data.deliveryDayNames.length) {
            return {
                success: false,
                message: "Satu atau lebih hari pengiriman tidak valid.",
            };
        }

        // --- 4. Validasi Harga di Sisi Server --- (Sudah benar)
        const actualPlanPrice = selectedMealPlan.price;
        const calculatedTotalPrice =
            actualPlanPrice *
            data.mealTypeNames.length *
            data.deliveryDayNames.length *
            4.3;

        if (
            Math.abs(
                parseFloat(calculatedTotalPrice.toFixed(2)) -
                parseFloat(data.totalPrice.toFixed(2)),
            ) > 0.01
        ) {
            console.warn(
                `Price mismatch: client sent ${data.totalPrice}, server calculated ${calculatedTotalPrice.toFixed(2)}`,
            );
            return {
                success: false,
                message: "Perhitungan harga tidak sesuai. Mohon coba lagi.",
            };
        }

        // --- 5. Buat Langganan Baru di Database --- (Sudah benar)
        const newSubscription = await prisma.subscription.create({
            data: {
                userId: userId, 
                fullName: data.fullName,
                phone: data.phone,
                mealPlanId: selectedMealPlan.id,
                allergies: data.allergies || null,
                totalPrice: data.totalPrice,
                mealTypes: {
                    create: mealTypesInDb.map((mt) => ({
                        mealTypeId: mt.id,
                    })),
                },
                deliveryDays: {
                    create: deliveryDaysInDb.map((dd) => ({
                        deliveryDayId: dd.id,
                    })),
                },
            },
            include: {
                mealPlan: true,
                mealTypes: { include: { mealType: true } },
                deliveryDays: { include: { deliveryDay: true } },
            },
        });

        // --- 6. KONVERSI OBJEK KE TIPE YANG BISA DISERIALISASI --- (Sudah benar)
        const serializableSubscription = {
            ...newSubscription,
            totalPrice: newSubscription.totalPrice.toNumber(),
            createdAt: newSubscription.createdAt.toISOString(),
            updatedAt: newSubscription.updatedAt.toISOString(),
            pausedStartDate: newSubscription.pausedStartDate?.toISOString() || null,
            pausedEndDate: newSubscription.pausedEndDate?.toISOString() || null,
            cancelledAt: newSubscription.cancelledAt?.toISOString() || null,
            reactivatedAt: newSubscription.reactivatedAt?.toISOString() || null,
            mealTypes: newSubscription.mealTypes.map((mt) => ({ ...mt, mealType: { ...mt.mealType } })),
            deliveryDays: newSubscription.deliveryDays.map((dd) => ({ ...dd, deliveryDay: { ...dd.deliveryDay } })),
        };

        console.log("New serializable subscription created:", serializableSubscription.id);
        return {
            success: true,
            message: "Langganan berhasil dibuat!",
            subscription: serializableSubscription,
        };
    } catch (error) {
        console.error("Error creating subscription:", error);
        if (error instanceof Error) {
            if (error.message.includes("Unique constraint failed")) {
                return {
                    success: false,
                    message: "Data duplikat terdeteksi. Silakan periksa input Anda.",
                };
            }
            return {
                success: false,
                message: `Gagal membuat langganan: ${error.message}`,
            };
        }
        return {
            success: false,
            message: "Gagal membuat langganan. Silakan coba lagi.",
        };
    }
}

export async function getSubscriptionFormData() {
    try {
        // ... (Kode ini sudah benar)
        const mealPlans = await prisma.mealPlan.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                imageUrl: true,
            },
            orderBy: { name: 'asc' }
        });

        const mealTypes = await prisma.mealType.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });

        const deliveryDays = await prisma.deliveryDay.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        });

        console.log("✅ Data form berhasil diambil dari database.");
        return {
            success: true,
            mealPlans,
            mealTypes,
            deliveryDays,
        };
    } catch (error) {
        console.error("Error fetching form data:", error);
        return {
            success: false,
            mealPlans: [],
            mealTypes: [],
            deliveryDays: [],
        };
    }
}