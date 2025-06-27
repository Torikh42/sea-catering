import { getSubscriptionFormData } from "@/action/subscription";
import SubscriptionForm from "@/components/SubscriptionForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
interface MealPlanData {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
}

interface MealTypeData {
  id: string;
  name: string;
}

interface DeliveryDayData {
  id: string;
  name: string;
}

export default async function SubscribePage() {
  const { mealPlans, mealTypes, deliveryDays, success } =
    await getSubscriptionFormData();

  if (!success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Gagal memuat form langganan.
          </h2>
          <p className="text-gray-600">
            Silakan coba segarkan halaman atau hubungi dukungan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingForm />}>
      <SubscriptionForm
        mealPlans={mealPlans as MealPlanData[]}
        mealTypes={mealTypes as MealTypeData[]}
        deliveryDays={deliveryDays as DeliveryDayData[]}
      />
    </Suspense>
  );
}

function LoadingForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="flex flex-col items-center justify-center text-blue-600">
        <Loader2 className="mb-4 h-12 w-12 animate-spin" />
        <p className="text-lg">Memuat form...</p>
      </div>
    </div>
  );
}
