"use client";

import { useState } from "react";
import { SerializableSubscription } from "@/action/userDashboard";
import {
  pauseSubscription,
  cancelSubscription,
  resumeSubscription,
} from "@/action/userDashboard";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import {
  Play,
  Pause,
  X,
  Calendar,
  Phone,
  Utensils,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { DatePicker } from "@/components/DatePicker";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubscriptionCardProps {
  subscription: SerializableSubscription;
  onUpdate: () => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "d MMMM", { locale: id });
};

export function SubscriptionCard({
  subscription,
  onUpdate,
}: SubscriptionCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [showPauseDates, setShowPauseDates] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [pauseEndDate, setPauseEndDate] = useState<Date | undefined>(undefined);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleConfirmPause = async () => {
    if (!pauseStartDate || !pauseEndDate) {
      toast.error("Validasi gagal.", {
        description: "Silakan pilih tanggal mulai dan akhir jeda.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await pauseSubscription(
        subscription.id,
        pauseStartDate,
        pauseEndDate,
      );

      if (result.success) {
        onUpdate();
        setShowPauseDates(false);
        setPauseStartDate(undefined);
        setPauseEndDate(undefined);
        toast.success("Langganan berhasil dijeda.", {
          description: result.message,
        });
      } else {
        setMessage(result.message);
        toast.error("Gagal menjeda langganan.", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error during pause confirmation:", error);
      setMessage("Terjadi kesalahan tak terduga. Silakan coba lagi.");
      toast.error("Terjadi kesalahan tak terduga.", {
        description: "Silakan periksa koneksi Anda dan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    setMessage("");

    const result = await cancelSubscription(subscription.id);
    setIsSubmitting(false);

    if (result.success) {
      onUpdate();
      toast.success("Langganan berhasil dibatalkan.", {
        description: `Langganan paket ${subscription.mealPlan.name} telah dihentikan.`,
      });
    } else {
      setMessage(result.message);
      toast.error("Gagal membatalkan langganan.", {
        description: result.message,
      });
    }
  };

  const handleResume = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await resumeSubscription(subscription.id);

      if (result.success) {
        onUpdate();
        toast.success("Langganan berhasil diaktifkan kembali.", {
          description: result.message,
        });
      } else {
        setMessage(result.message);
        toast.error("Gagal mengaktifkan langganan kembali.", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error resuming subscription:", error);
      setMessage("Terjadi kesalahan tak terduga. Silakan coba lagi.");
      toast.error("Terjadi kesalahan tak terduga.", {
        description: "Silakan periksa koneksi Anda dan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-700 border-green-200",
          text: "Aktif",
        };
      case "paused":
        return {
          icon: Pause,
          color: "bg-amber-100 text-amber-700 border-amber-200",
          text: "Jeda",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "bg-gray-100 text-gray-500 border-gray-200",
          text: "Dibatalkan",
        };
      default:
        return {
          icon: AlertCircle,
          color: "bg-gray-100 text-gray-500 border-gray-200",
          text: "Tidak Diketahui",
        };
    }
  };

  const statusConfig = getStatusConfig(subscription.status);
  const StatusIcon = statusConfig.icon;
  const isSuccess = message.includes("berhasil");
  const AlertIcon = isSuccess ? CheckCircle : AlertCircle;

  const actionButtonClasses =
    "flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="group relative mx-auto max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative min-h-[180px] overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-5 md:min-h-[240px] lg:min-h-[280px]">
        {subscription.mealPlan.imageUrl && (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={subscription.mealPlan.imageUrl}
              alt={subscription.mealPlan.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        <div className="relative z-10 flex h-full min-h-[156px] flex-col justify-between md:min-h-[216px] lg:min-h-[256px]">
          <div className="flex items-start justify-between">
            <div className="max-w-[70%] flex-1">
              <h3 className="mb-2 text-xl leading-tight font-bold text-white md:text-2xl lg:text-3xl">
                {subscription.mealPlan.name}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-blue-100">
                {subscription.mealPlan.description}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 ${statusConfig.color} relative z-20 flex-shrink-0 backdrop-blur-sm`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">{statusConfig.text}</span>
            </div>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      <div className="relative z-30 -mt-6 mb-6 flex justify-center">
        <div className="rounded-xl border border-gray-100 bg-white px-6 py-3 shadow-lg">
          <div className="text-center text-xs font-medium text-gray-500">
            Total Harga
          </div>
          <div className="text-center text-xl font-bold text-gray-900 md:text-2xl">
            {formatPrice(subscription.totalPrice)}
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="mb-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Utensils className="h-4 w-4 text-orange-500" />
            Tipe Makanan
          </h4>
          <div className="flex flex-wrap gap-3">
            {subscription.mealTypes.map((mealType, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {mealType.name}
                  </p>
                  <p className="text-xs text-gray-500">Per hari</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Kontak</p>
              <p className="text-sm text-gray-600">{subscription.fullName}</p>
              <p className="text-sm text-gray-600">{subscription.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Truck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Hari Pengiriman
              </p>
              <p className="text-sm text-gray-600">
                {subscription.deliveryDays.map((dd) => dd.name).join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Tanggal Mulai</p>
              <p className="text-sm text-gray-600">
                {formatDate(subscription.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Harga Paket</p>
              <p className="text-sm text-gray-600">
                {formatPrice(subscription.mealPlan.price)}
              </p>
            </div>
          </div>
        </div>

        {subscription.pausedStartDate && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <p className="font-semibold text-amber-800">Periode Jeda</p>
            </div>
            <p className="text-sm text-amber-700">
              {formatDate(subscription.pausedStartDate)} -{" "}
              {formatDate(subscription.pausedEndDate)}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {subscription.status === "active" && (
            <>
              {showPauseDates ? (
                <div className="flex w-full flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-inner">
                  <p className="text-sm font-semibold text-amber-800">
                    Pilih rentang tanggal jeda:
                  </p>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Mulai Jeda
                      </label>
                      <DatePicker
                        date={pauseStartDate ?? null}
                        setDate={setPauseStartDate}
                        placeholder="Tanggal Mulai"
                        minDate={new Date()}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Akhir Jeda
                      </label>
                      <DatePicker
                        date={pauseEndDate ?? null}
                        setDate={setPauseEndDate}
                        placeholder="Tanggal Akhir"
                        minDate={pauseStartDate || new Date()}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleConfirmPause}
                      disabled={
                        isSubmitting || !pauseStartDate || !pauseEndDate
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Memproses..." : "Konfirmasi Jeda"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPauseDates(false);
                        setMessage("");
                        setPauseStartDate(undefined);
                        setPauseEndDate(undefined);
                      }}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPauseDates(true)}
                  disabled={isSubmitting}
                  className={`${actionButtonClasses} bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600`}
                >
                  <Pause className="h-4 w-4" />
                  Jeda Langganan
                </button>
              )}

              <Dialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <DialogTrigger asChild>
                  <button
                    disabled={isSubmitting}
                    className={`${actionButtonClasses} bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600`}
                  >
                    <X className="h-4 w-4" />
                    Batalkan
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apakah Anda yakin?</DialogTitle>
                    <DialogDescription>
                      Tindakan ini tidak dapat diurungkan. Ini akan membatalkan
                      langganan Anda secara permanen.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting ? "Memproses..." : "Ya, Batalkan Langganan"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {subscription.status === "paused" && (
            <button
              onClick={handleResume}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-green-600 hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isSubmitting ? "Memproses..." : "Aktifkan Kembali"}
            </button>
          )}
          {subscription.status === "cancelled" && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-gray-500">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Langganan Dibatalkan</span>
            </div>
          )}
        </div>

        {message && (
          <Alert
            className={`mt-4 ${isSuccess ? "border-emerald-200" : "border-red-200"} bg-white shadow`}
          >
            <AlertIcon
              className={`h-4 w-4 ${isSuccess ? "text-emerald-600" : "text-red-600"}`}
            />
            <AlertDescription
              className={`${isSuccess ? "text-emerald-800" : "text-red-800"} text-sm font-medium`}
            >
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
