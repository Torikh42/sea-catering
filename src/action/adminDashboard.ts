"use server";

import { SubscriptionStatus } from "@prisma/client";
import { isWithinInterval, eachMonthOfInterval, format } from "date-fns";
import { getUser } from "@/auth/server";
import prisma from "../../prisma/prisma";

export interface DashboardMetrics {
  newSubscriptions: number;
  monthlyRecurringRevenue: number;
  reactivations: number;
  activeSubscriptions: number;
}

export interface MonthlyChartData {
  name: string;
  newSubscriptions: number;
  mrr: number;
}

export interface StatusDistributionData {
  name: string;
  value: number;
}

/**
 * Fetches key business metrics for the admin dashboard within a specified date range.
 * @param startDate The start date of the reporting period.
 * @param endDate The end date of the reporting period.
 * @returns An object with various metrics.
 */
export async function getAdminMetrics(
  startDate: Date,
  endDate: Date,
): Promise<DashboardMetrics> {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized access. Admin role required.");
    }

    const subscriptionsInPeriod = await prisma.subscription.findMany({
      where: {
        OR: [
          { createdAt: { gte: startDate, lte: endDate } },

          { status: SubscriptionStatus.active, createdAt: { lte: endDate } },
          { status: SubscriptionStatus.paused, createdAt: { lte: endDate } },

          { cancelledAt: { gte: startDate, lte: endDate } },
          { reactivatedAt: { gte: startDate, lte: endDate } },
        ],
      },
      include: { mealPlan: true },
      orderBy: { createdAt: "asc" },
    });

    let newSubscriptions = 0;
    let monthlyRecurringRevenue = 0;
    let reactivations = 0;

    for (const sub of subscriptionsInPeriod) {
      if (isWithinInterval(sub.createdAt, { start: startDate, end: endDate })) {
        newSubscriptions++;
      }

      const wasActiveDuringPeriod =
        sub.status === SubscriptionStatus.active ||
        (sub.status === SubscriptionStatus.cancelled &&
          sub.cancelledAt &&
          sub.cancelledAt >= startDate);

      if (wasActiveDuringPeriod) {
        monthlyRecurringRevenue += sub.totalPrice.toNumber();
      }

      if (
        sub.reactivatedAt &&
        isWithinInterval(sub.reactivatedAt, { start: startDate, end: endDate })
      ) {
        reactivations++;
      }
    }

    const totalActiveSubscriptions = await prisma.subscription.count({
      where: { status: SubscriptionStatus.active },
    });

    console.log(
      `Calculated metrics for range ${startDate.toISOString()} - ${endDate.toISOString()}`,
    );
    return {
      newSubscriptions: newSubscriptions,
      monthlyRecurringRevenue: monthlyRecurringRevenue,
      reactivations: reactivations,
      activeSubscriptions: totalActiveSubscriptions,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard metrics:", error);
    throw new Error(
      "Gagal mengambil metrik dashboard admin. Silakan coba lagi.",
    );
  }
}

/**
 * Fetches historical metrics for charting, grouped by month.
 * @param startDate The start date of the reporting period.
 * @param endDate The end date of the reporting period.
 * @returns An object containing monthly chart data and status distribution data.
 */
export async function getDashboardChartData(
  startDate: Date,
  endDate: Date,
): Promise<{ monthly: MonthlyChartData[]; status: StatusDistributionData[] }> {
  try {
    const user = await getUser();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized access. Admin role required.");
    }

    const subscriptionsInChartRange = await prisma.subscription.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      include: { mealPlan: true },
      orderBy: { createdAt: "asc" },
    });

    const monthlyDataMap = new Map<
      string,
      { newSubscriptions: number; mrr: number }
    >();
    const monthsInInterval = eachMonthOfInterval({
      start: startDate,
      end: endDate,
    });

    monthsInInterval.forEach((month) => {
      const monthKey = format(month, "MMM");
      monthlyDataMap.set(monthKey, { newSubscriptions: 0, mrr: 0 });
    });

    for (const sub of subscriptionsInChartRange) {
      const monthKey = format(sub.createdAt, "MMM");
      const data = monthlyDataMap.get(monthKey);
      if (data) {
        data.newSubscriptions++;
        data.mrr += sub.totalPrice.toNumber();
      }
    }

    const monthlyChartData = Array.from(monthlyDataMap.entries()).map(
      ([name, data]) => ({
        name,
        newSubscriptions: data.newSubscriptions,
        mrr: data.mrr,
      }),
    );

    const statusCounts = await prisma.subscription.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    const statusDistributionData = statusCounts.map((item) => ({
      name:
        item.status.charAt(0).toUpperCase() +
        item.status.slice(1).toLowerCase(), // Format 'active' -> 'Active'
      value: item._count.id,
    }));

    console.log(
      "Calculated chart data:",
      monthlyChartData,
      statusDistributionData,
    );

    return {
      monthly: JSON.parse(JSON.stringify(monthlyChartData)),
      status: JSON.parse(JSON.stringify(statusDistributionData)),
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw new Error("Gagal mengambil data grafik. Silakan coba lagi.");
  }
}
