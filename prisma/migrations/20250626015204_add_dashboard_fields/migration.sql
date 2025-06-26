/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId,deliveryDayId]` on the table `SubscriptionDeliveryDay` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId,mealTypeId]` on the table `SubscriptionMealType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'completed';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "pausedEndDate" TIMESTAMP(3),
ADD COLUMN     "pausedStartDate" TIMESTAMP(3),
ADD COLUMN     "reactivatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_createdAt_idx" ON "Subscription"("createdAt");

-- CreateIndex
CREATE INDEX "Subscription_cancelledAt_idx" ON "Subscription"("cancelledAt");

-- CreateIndex
CREATE INDEX "Subscription_reactivatedAt_idx" ON "Subscription"("reactivatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionDeliveryDay_subscriptionId_deliveryDayId_key" ON "SubscriptionDeliveryDay"("subscriptionId", "deliveryDayId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionMealType_subscriptionId_mealTypeId_key" ON "SubscriptionMealType"("subscriptionId", "mealTypeId");
