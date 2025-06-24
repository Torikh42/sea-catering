// "use server";
// import { prisma } from "../../prisma/prisma";

// export async function createSubscription(data: {
//   userId: string;
//   name: string;
//   phone: string;
//   plan: string;
//   mealTypes: string[];
//   deliveryDays: string[];
//   allergies?: string;
//   totalPrice: number;
// }) {
//   return prisma.subscription.create({
//     data: {
//       userId: data.userId,
//       name: data.name,
//       phone: data.phone,
//       plan: data.plan,
//       mealTypes: data.mealTypes.join(","),
//       deliveryDays: data.deliveryDays.join(","),
//       allergies: data.allergies,
//       totalPrice: data.totalPrice,
//     },
//   });
// }
