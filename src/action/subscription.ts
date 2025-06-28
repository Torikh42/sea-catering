"use server";

import { prisma } from "../../prisma/prisma";

export interface CreateSubscriptionInput {
    fullName: string;
    phone: string;
    planName: string;
    mealTypeNames: string[];
    deliveryDayNames: string[];
    allergies?: string;
    totalPrice: number;
}

export async function createSubscription(data: CreateSubscriptionInput) {
    try {
        // --- 1. Validasi Dasar Data Input ---
        if (!data.fullName || !data.phone || data.mealTypeNames.length === 0 || data.deliveryDayNames.length === 0 || data.totalPrice <= 0) {
            return { success: false, message: "Semua bidang bertanda (*) harus diisi." };
        }
        if (!/^\d+$/.test(data.phone)) {
            return { success: false, message: "Nomor telepon harus berisi hanya angka." };
        }

        // --- 2. Dapatkan User ID (Penting: Sesuaikan dengan sistem autentikasi Anda) ---
        let existingUser = await prisma.user.findFirst(); // Untuk demo, ambil user pertama.
        if (!existingUser) {
            // Jika tidak ada user, buat user dummy untuk demo.
            // DI PRODUKSI, JANGAN LAKUKAN INI! Ini harus datang dari Supabase Auth session.
            existingUser = await prisma.user.create({
                data: {
                    fullName: "Demo User",
                    email: `demo_user_${Date.now()}@example.com`, // Email unik untuk demo
                    // Password tidak disimpan di sini karena Supabase yang mengelola
                    // Pastikan field password di schema.prisma User adalah String? (opsional)
                }
            });
            console.warn("WARNING: Created a dummy user for subscription. This should come from an authenticated session in production.");
        }
        const userId = existingUser.id;


        // --- 3. Dapatkan ID dari Nama Plan, Meal Types, dan Delivery Days ---
        const selectedMealPlan = await prisma.mealPlan.findFirst({
            where: { name: data.planName }
        });
        if (!selectedMealPlan) {
            return { success: false, message: "Paket makanan tidak valid." };
        }

        const mealTypesInDb = await prisma.mealType.findMany({
            where: { name: { in: data.mealTypeNames } }
        });
        if (mealTypesInDb.length !== data.mealTypeNames.length) {
            return { success: false, message: "Satu atau lebih tipe makanan tidak valid." };
        }

        const deliveryDaysInDb = await prisma.deliveryDay.findMany({
            where: { name: { in: data.deliveryDayNames } }
        });
        if (deliveryDaysInDb.length !== data.deliveryDayNames.length) {
            return { success: false, message: "Satu atau lebih hari pengiriman tidak valid." };
        }

        // --- 4. Validasi Harga di Sisi Server ---
        const actualPlanPrice = selectedMealPlan.price;
        const calculatedTotalPrice = actualPlanPrice * data.mealTypeNames.length * data.deliveryDayNames.length * 4.3;

        // Izinkan sedikit perbedaan karena floating point, atau bulatkan di client/server
        if (Math.abs(parseFloat(calculatedTotalPrice.toFixed(2)) - parseFloat(data.totalPrice.toFixed(2))) > 0.01) {
            console.warn(`Price mismatch: client sent ${data.totalPrice}, server calculated ${calculatedTotalPrice.toFixed(2)}`);
            return { success: false, message: "Perhitungan harga tidak sesuai. Mohon coba lagi." };
        }

        // --- 5. Buat Langganan Baru di Database ---
        const newSubscription = await prisma.subscription.create({
            data: {
                userId: userId,
                fullName: data.fullName,
                phone: data.phone,
                mealPlanId: selectedMealPlan.id,
                allergies: data.allergies || null,
                totalPrice: data.totalPrice, // Prisma secara otomatis mengkonversi number ke Decimal
                mealTypes: {
                    create: mealTypesInDb.map(mt => ({
                        mealTypeId: mt.id,
                    }))
                },
                deliveryDays: {
                    create: deliveryDaysInDb.map(dd => ({
                        deliveryDayId: dd.id,
                    }))
                }
            },
            // Sertakan relasi yang perlu dikembalikan ke Client Component.
            // Penting: Pastikan semua properti di sini dapat diserialisasi.
            include: {
                mealPlan: true,
                mealTypes: { include: { mealType: true } },
                deliveryDays: { include: { deliveryDay: true } },
            }
        });

        // --- 6. KONVERSI OBJEK KE TIPE YANG BISA DISERIALISASI UNTUK CLIENT COMPONENT ---
        // Objek Decimal dari Prisma dan objek Date standar JavaScript tidak bisa langsung diserialisasi
        // Konversi totalPrice dari Decimal ke number
        // Konversi createdAt dan updatedAt dari Date ke ISO string
        const serializableSubscription = {
            ...newSubscription,
            totalPrice: newSubscription.totalPrice.toNumber(), // Konversi Decimal ke number
            createdAt: newSubscription.createdAt.toISOString(),
            updatedAt: newSubscription.updatedAt.toISOString(),
            // Konversi properti Date di dalam relasi jika ada (misal createdAt/updatedAt di SubscriptionMealType)
            mealTypes: newSubscription.mealTypes.map(mt => ({
                ...mt,
                // Jika SubscriptionMealType memiliki createdAt/updatedAt
                // createdAt: mt.createdAt?.toISOString(),
                // updatedAt: mt.updatedAt?.toISOString(),
                mealType: { // Pastikan objek nested juga diserialisasi
                    ...mt.mealType,
                    // Jika MealType memiliki createdAt/updatedAt
                    // createdAt: mt.mealType?.createdAt?.toISOString(),
                    // updatedAt: mt.mealType?.updatedAt?.toISOString(),
                }
            })),
            deliveryDays: newSubscription.deliveryDays.map(dd => ({
                ...dd,
                // Jika SubscriptionDeliveryDay memiliki createdAt/updatedAt
                // createdAt: dd.createdAt?.toISOString(),
                // updatedAt: dd.updatedAt?.toISOString(),
                deliveryDay: { // Pastikan objek nested juga diserialisasi
                    ...dd.deliveryDay,
                    // Jika DeliveryDay memiliki createdAt/updatedAt
                    // createdAt: dd.deliveryDay?.createdAt?.toISOString(),
                    // updatedAt: dd.deliveryDay?.updatedAt?.toISOString(),
                }
            })),
            mealPlan: { // Pastikan mealPlan juga diserialisasi
                ...newSubscription.mealPlan,
                // Jika MealPlan memiliki createdAt/updatedAt
                // createdAt: newSubscription.mealPlan.createdAt?.toISOString(),
                // updatedAt: newSubscription.mealPlan.updatedAt?.toISOString(),
            }
        };

        console.log("New serializable subscription created:", serializableSubscription);
        return { success: true, message: "Langganan berhasil dibuat!", subscription: serializableSubscription };
    } catch (error) {
        console.error("Error creating subscription:", error);
        if (error instanceof Error) {
            // Memberikan pesan error yang lebih user-friendly untuk Prisma errors tertentu
            if (error.message.includes('Unique constraint failed')) {
                return { success: false, message: "Data duplikat terdeteksi. Silakan periksa input Anda." };
            }
            return { success: false, message: `Gagal membuat langganan: ${error.message}` };
        }
        return { success: false, message: "Gagal membuat langganan. Silakan coba lagi." };
    }
}