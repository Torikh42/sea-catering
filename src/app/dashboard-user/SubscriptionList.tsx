"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SerializableSubscription,
  getUserSubscriptions,
} from "@/action/userDashboard";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Plus, Package, AlertCircle } from "lucide-react";

interface SubscriptionListProps {
  initialSubscriptions: SerializableSubscription[];
}

export function SubscriptionList({
  initialSubscriptions,
}: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      setError("Gagal memuat ulang data langganan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Langganan Saya</h2>
          </div>
          <Button disabled variant="outline" size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memuat...
          </Button>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Langganan Saya</h2>
          </div>
          <Button onClick={fetchSubscriptions} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Langganan Saya</h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
            {subscriptions.length}
          </span>
        </div>
        <Button
          onClick={fetchSubscriptions}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onUpdate={fetchSubscriptions}
            />
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 transition-colors duration-200 hover:border-blue-400">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 rounded-full bg-blue-50 p-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Belum Ada Langganan
            </h3>

            <p className="mb-6 max-w-md text-gray-500">
              Anda belum memiliki langganan aktif. Mulai dengan memilih paket
              langganan yang sesuai dengan kebutuhan Anda.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => router.push("/subscription")}
                className="bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat Langganan Pertama
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/menu")}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Lihat Menu
              </Button>
            </div>

            <div className="mt-8 grid w-full max-w-md grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                </div>
                <span>Menu Berkualitas</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <div className="h-2 w-2 rounded-full bg-orange-600"></div>
                </div>
                <span>Pengiriman Tepat Waktu</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                </div>
                <span>Harga Terjangkau</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
