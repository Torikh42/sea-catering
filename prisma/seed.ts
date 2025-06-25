import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.mealPlan.createMany({
    data: [
      {
        name: "Paket Sehat Harian",
        price: 45000,
        description:
          "Menu seimbang dengan protein, karbohidrat, dan sayuran segar untuk kebutuhan harian Anda",
        imageUrl:
          "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837507/a0e31ba7-bfb6-41cc-ba73-a087e1b1e089_wybtsk.jpg",
      },
      {
        name: "Paket Diet Rendah Kalori",
        price: 30000,
        description:
          "Cocok untuk Anda yang sedang menjalani diet, termasuk oatmeal, dada ayam, dan sayur kukus",
        imageUrl:
          "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837055/d801bbd7-eabf-483a-b4b4-6df6d53ffe92_rrtekw.jpg",
      },
      {
        name: "Paket Protein Maksimal",
        price: 40000,
        description:
          "Untuk pembentukan otot, terdiri dari daging sapi panggang, telur rebus, dan quinoa",
        imageUrl: "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837607/5f530d13-9f24-4a3a-913f-4b37ff9b3558_oc2nha.jpg",
      },
      {
        name: "Paket Royal Premium",
        price: 60000,
        description:
          "Pilihan terbaik dengan bahan premium: salmon, asparagus, dan salad buah eksotis",
        imageUrl: "https://res.cloudinary.com/dsw1iot8d/image/upload/v1750837688/97fa17bb-2ad6-4b92-a216-aed9fd38acd6_cwbikv.jpg",
      },
    ],
  });

  console.log("✅ Seed data berhasil ditambahkan ke MealPlan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
