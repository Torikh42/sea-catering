import { getSubscriptionFormData } from "@/action/subscription";
import SubscriptionForm from "@/components/SubscriptionForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Tipe data yang diambil dari Server Action
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
    // --- Fetch data dari Server Action ---
    // Next.js akan meng-cache hasil fetching ini secara otomatis
    const { mealPlans, mealTypes, deliveryDays, success } = await getSubscriptionFormData();

    if (!success) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Gagal memuat form langganan.</h2>
                    <p className="text-gray-600">Silakan coba segarkan halaman atau hubungi dukungan.</p>
                </div>
            </div>
        );
    }

    // Teruskan data yang diambil sebagai props ke Client Component
    return (
        // Gunakan Suspense untuk loading state
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="flex flex-col items-center justify-center text-blue-600">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg">Memuat form...</p>
            </div>
        </div>
    );
}