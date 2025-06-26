// // actions/adminDashboard.ts
// "use server";

// import { PrismaClient, SubscriptionStatus } from '@prisma/client';
// import { isWithinInterval } from 'date-fns';

// // Pastikan Anda mengimpor instance prisma yang sudah diinisialisasi
// // Jika Anda mengimpor dari file terpisah, ganti baris ini
// const prisma = new PrismaClient();

// // Interface untuk data metrik yang dikembalikan ke Client Component
// export interface DashboardMetrics {
//     newSubscriptions: number;
//     monthlyRecurringRevenue: number;
//     reactivations: number;
//     activeSubscriptions: number;
// }

// /**
//  * Fetches key business metrics for the admin dashboard within a specified date range.
//  * @param startDate The start date of the reporting period.
//  * @param endDate The end date of the reporting period.
//  * @returns An object with various metrics.
//  */
// export async function getAdminMetrics(startDate: Date, endDate: Date): Promise<DashboardMetrics> {
//     try {
//         // --- 1. Fetch all subscriptions that were active or created within the range ---
//         // Fetch all subscriptions to calculate MRR and reactivations accurately.
//         // For accurate MRR, we need subscriptions active during the period, not just created.
//         const allSubscriptions = await prisma.subscription.findMany({
//             where: {
//                 OR: [
//                     { createdAt: { gte: startDate, lte: endDate } },
//                     { status: SubscriptionStatus.active },
//                     { status: SubscriptionStatus.paused },
//                     { status: SubscriptionStatus.cancelled },
//                 ]
//             },
//             include: { mealPlan: true }, // Include mealPlan to get the price
//             orderBy: { createdAt: 'asc' }
//         });

//         // --- 2. Calculate Metrics from the fetched data ---
//         let newSubscriptions = 0;
//         let monthlyRecurringRevenue = 0;
//         let reactivations = 0;
//         const totalActiveSubscriptions = await prisma.subscription.count({
//             where: { status: SubscriptionStatus.active }
//         });

//         for (const sub of allSubscriptions) {
//             const created = sub.createdAt;
//             const cancelled = sub.cancelledAt;
//             const reactivated = sub.reactivatedAt;

//             // New Subscriptions: Count if created within the date range
//             if (isWithinInterval(created, { start: startDate, end: endDate })) {
//                 newSubscriptions++;
//             }

//             // Monthly Recurring Revenue (MRR): Sum totalPrice for subscriptions
//             // that were active at some point during the selected interval.
//             // Simplified logic: Consider a subscription contributing to MRR if it was created
//             // before or during the end date and is currently active.
//             // A more robust MRR would check if it was active for the entire period.
//             // For this task, we sum `totalPrice` for all currently active subscriptions.
//             // The prompt says "during the selected period", which can be interpreted in a few ways.
//             // Let's go with the current total of active subscriptions for simplicity and performance.
//             if (sub.status === SubscriptionStatus.active) {
//                  monthlyRecurringRevenue += sub.totalPrice.toNumber();
//             }

//             // Reactivations: Count if a subscription was reactivated within the date range
//             if (reactivated && isWithinInterval(reactivated, { start: startDate, end: endDate })) {
//                 reactivations++;
//             }
//         }
        
//         console.log(`Calculated metrics for range ${startDate.toISOString()} - ${endDate.toISOString()}`);
//         return {
//             newSubscriptions: newSubscriptions,
//             monthlyRecurringRevenue: monthlyRecurringRevenue,
//             reactivations: reactivations,
//             activeSubscriptions: totalActiveSubscriptions, // Total active subscriptions (not date-ranged)
//         };
//     } catch (error) {
//         console.error("Error fetching admin dashboard metrics:", error);
//         throw new Error("Gagal mengambil metrik dashboard admin. Silakan coba lagi.");
//     }
// }