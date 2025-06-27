"use server";

import { SubscriptionStatus } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { createClient } from "@/auth/server";
import { PauseSubscriptionSchema } from "@/schema/subscriptionSchema";

export interface SerializableSubscription {
  id: string;
  fullName: string;
  phone: string;
  totalPrice: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  pausedStartDate: string | null;
  pausedEndDate: string | null;
  cancelledAt: string | null;
  reactivatedAt: string | null;
  mealPlan: {
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
  };
  mealTypes: { name: string }[];
  deliveryDays: { name: string }[];
}

type ActionResponse = {
  success: boolean;
  message: string;
};

/**
 * Fetches all subscriptions for the authenticated user.
 * It now gets the user ID directly from the Supabase session,
 * preventing unauthorized data access.
 * @returns An array of serializable subscription objects.
 */
export async function getUserSubscriptions(): Promise<
  SerializableSubscription[]
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Authorization Error: User not authenticated.");
      return [];
    }

    const userId = user.id;

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: userId,
        status: {
          in: [SubscriptionStatus.active, SubscriptionStatus.paused],
        },
      },
      include: {
        mealPlan: true,
        mealTypes: {
          include: {
            mealType: true,
          },
        },
        deliveryDays: { include: { deliveryDay: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializableSubscriptions = subscriptions.map((sub) => ({
      id: sub.id,
      fullName: sub.fullName,
      phone: sub.phone,
      totalPrice: sub.totalPrice.toNumber(),
      status: sub.status,
      createdAt: sub.createdAt.toISOString(),
      updatedAt: sub.updatedAt.toISOString(),
      pausedStartDate: sub.pausedStartDate?.toISOString() || null,
      pausedEndDate: sub.pausedEndDate?.toISOString() || null,
      cancelledAt: sub.cancelledAt?.toISOString() || null,
      reactivatedAt: sub.reactivatedAt?.toISOString() || null,
      mealPlan: {
        name: sub.mealPlan.name,
        description: sub.mealPlan.description,
        price: sub.mealPlan.price,
        imageUrl: sub.mealPlan.imageUrl,
      },
      mealTypes: sub.mealTypes.map((mt) => ({ name: mt.mealType.name })),
      deliveryDays: sub.deliveryDays.map((dd) => ({
        name: dd.deliveryDay.name,
      })),
    }));

    const finalSubscriptions = JSON.parse(
      JSON.stringify(serializableSubscriptions),
    );

    console.log(
      `Fetched ${finalSubscriptions.length} subscriptions for user ${userId}`,
    );

    return finalSubscriptions;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw new Error("Gagal mengambil data langganan. Silakan coba lagi.");
  }
}

/**
 * Pauses a subscription for a specific date range.
 * It now checks for user authorization and validates dates.
 * @param subscriptionId The ID of the subscription to pause.
 * @param startDate The start date of the pause period.
 * @param endDate The end date of the pause period.
 * @returns A response object with success status and a message.
 */
export async function pauseSubscription(
  subscriptionId: string,
  startDate: Date,
  endDate: Date,
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return { success: false, message: "Akses ditolak. Anda harus login." };

    const validationResult = PauseSubscriptionSchema.safeParse({
      subscriptionId,
      startDate,
      endDate,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      console.error("Validation Error:", errorMessage);
      return { success: false, message: errorMessage };
    }

    const validatedData = validationResult.data;

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: validatedData.subscriptionId,
        userId: user.id,
      },
      data: {
        status: SubscriptionStatus.paused,
        pausedStartDate: validatedData.startDate,
        pausedEndDate: validatedData.endDate,
      },
    });

    if (!updatedSubscription) {
      return {
        success: false,
        message: "Langganan tidak ditemukan atau Anda tidak memiliki izin.",
      };
    }

    console.log(
      `Subscription ${subscriptionId} paused from ${startDate} to ${endDate} by user ${user.id}`,
    );
    return { success: true, message: "Langganan berhasil dijeda." };
  } catch (error) {
    console.error("Error pausing subscription:", error);
    return {
      success: false,
      message: "Gagal menjeda langganan. Silakan coba lagi.",
    };
  }
}

/**
 * Cancels a subscription.
 * It now checks for user authorization.
 * @param subscriptionId The ID of the subscription to cancel.
 * @returns A response object with success status and a message.
 */
export async function cancelSubscription(
  subscriptionId: string,
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return { success: false, message: "Akses ditolak. Anda harus login." };

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
      data: {
        status: SubscriptionStatus.cancelled,
        cancelledAt: new Date(),
      },
    });

    if (!updatedSubscription) {
      return {
        success: false,
        message: "Langganan tidak ditemukan atau Anda tidak memiliki izin.",
      };
    }

    console.log(
      `Subscription ${subscriptionId} has been cancelled by user ${user.id}`,
    );
    return { success: true, message: "Langganan berhasil dibatalkan." };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return {
      success: false,
      message: "Gagal membatalkan langganan. Silakan coba lagi.",
    };
  }
}

/**
 * Resumes a paused or cancelled subscription.
 * It now checks for user authorization.
 * @param subscriptionId The ID of the subscription to resume.
 * @returns A response object with success status and a message.
 */
export async function resumeSubscription(
  subscriptionId: string,
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return { success: false, message: "Akses ditolak. Anda harus login." };

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
      data: {
        status: SubscriptionStatus.active,
        pausedStartDate: null,
        pausedEndDate: null,
        reactivatedAt: new Date(),
      },
    });

    if (!updatedSubscription) {
      return {
        success: false,
        message: "Langganan tidak ditemukan atau Anda tidak memiliki izin.",
      };
    }

    console.log(
      `Subscription ${subscriptionId} has been resumed/reactivated by user ${user.id}`,
    );
    return { success: true, message: "Langganan berhasil diaktifkan kembali." };
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return {
      success: false,
      message: "Gagal mengaktifkan langganan kembali. Silakan coba lagi.",
    };
  }
}
