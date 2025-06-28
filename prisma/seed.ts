// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Meal Plans (pastikan nama dan harga sesuai dengan prompt)
  await prisma.mealPlan.createMany({
    data: [
      // Sesuai dengan prompt: Diet Plan – Rp30.000,00 per meal
      {
        name: "Paket Diet Rendah Kalori",
        price: 30000,
        description: "Menu seimbang dengan protein, karbohidrat, dan sayuran segar untuk kebutuhan harian Anda",
        imageUrl:
          "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837055/d801bbd7-eabf-483a-b4b4-6df6d53ffe92_rrtekw.jpg",
      },
      // Sesuai dengan prompt: Protein Plan – Rp40.000,00 per meal
      {
        name: "Paket Protein Maksimal",
        price: 40000,
        description:
          "Untuk pembentukan otot, terdiri dari daging sapi panggang, telur rebus, dan quinoa",
        imageUrl: "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837607/5f530d13-9f24-4a3a-913f-4b37ff9b3558_oc2nha.jpg",
      },
      // Sesuai dengan prompt: Royal Plan – Rp60.000,00 per meal
      {
        name: "Paket Royal Premium",
        price: 60000,
        description:
          "Pilihan terbaik dengan bahan premium: salmon, asparagus, dan salad buah eksotis",
        imageUrl: "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837688/97fa17bb-2ad6-4b92-a216-aed9fd38acd6_cwbikv.jpg",
      },
      // Ini dari seed Anda sebelumnya, tidak ada di prompt, tapi bisa tetap ada
      {
        name: "Paket Sehat Harian",
        price: 45000,
        description:
          "Menu seimbang dengan protein, karbohidrat, dan sayuran segar untuk kebutuhan harian Anda",
        imageUrl:
          "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837507/a0e31ba7-bfb6-41cc-ba73-a087e1b1e089_wybtsk.jpg",
      },
    ],
    skipDuplicates: true, // Penting agar tidak error jika dijalankan berkali-kali
  });
  console.log("✅ Seed data untuk MealPlan berhasil ditambahkan/diperbarui!");

  // Seed Meal Types
  await prisma.mealType.createMany({
    data: [
      { name: "Breakfast" },
      { name: "Lunch" },
      { name: "Dinner" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seed data untuk MealType berhasil ditambahkan/diperbarui!");

  // Seed Delivery Days
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  await prisma.deliveryDay.createMany({
    data: daysOfWeek.map((day) => ({ name: day })),
    skipDuplicates: true,
  });
  console.log("✅ Seed data untuk DeliveryDay berhasil ditambahkan/diperbarui!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });