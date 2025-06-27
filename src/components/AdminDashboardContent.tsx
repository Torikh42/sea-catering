"use client";

import React, { useState, useEffect, useCallback } from "react";
// Impor fungsi baru dari action
import {
  getAdminMetrics,
  getDashboardChartData,
  DashboardMetrics,
  MonthlyChartData,
  StatusDistributionData,
} from "@/action/adminDashboard";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface AdminDashboardContentProps {
  initialMetrics: DashboardMetrics;
}

// Helper untuk format harga
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AdminDashboardContent({
  initialMetrics,
}: AdminDashboardContentProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyChartData[]>(
    [],
  );
  const [statusChartData, setStatusChartData] = useState<
    StatusDistributionData[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default date range: last 6 months for charts, current month for cards
  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth() - 5, 1),
  ); // 6 bulan terakhir
  const [endDate, setEndDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth() + 1, 0),
  ); // Akhir bulan ini

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil data untuk metrik kartu (total dalam rentang)
      const cardData = await getAdminMetrics(startDate, endDate);
      setMetrics(cardData);

      // Ambil data untuk grafik (bulanan dan status)
      const chartData = await getDashboardChartData(startDate, endDate);
      setMonthlyChartData(chartData.monthly);
      setStatusChartData(chartData.status);
    } catch (err: unknown) {
      console.error("Error fetching admin metrics:", err);
      if (err instanceof Error) {
        setError(err.message || "Gagal memuat metrik dashboard.");
      } else {
        setError("Gagal memuat metrik dashboard.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Date Range Selector with Shadcn components */}
      <Card className="p-6">
        <CardHeader className="mb-4 p-0">
          <CardTitle className="text-xl">Filter Data</CardTitle>
          <CardDescription>
            Pilih rentang tanggal untuk melihat metrik.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-end gap-4 md:flex-row">
            {/* Start Date Picker */}
            <div className="w-full flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mulai Tanggal
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: id })
                    ) : (
                      <span>Pilih Tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate as (date: Date | undefined) => void}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Picker */}
            <div className="w-full flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Akhir Tanggal
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP", { locale: id })
                    ) : (
                      <span>Pilih Tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate as (date: Date | undefined) => void}
                    initialFocus
                    disabled={{ before: startDate }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              onClick={fetchMetrics}
              disabled={isLoading}
              className="mt-4 w-full px-8 py-6 md:mt-0 md:w-auto"
            >
              {isLoading ? "Memuat..." : "Terapkan Filter"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div
          className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
          role="alert"
        >
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      )}

      {/* Metrics Cards using Shadcn Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Langganan Baru"
          value={metrics.newSubscriptions.toLocaleString("id-ID")}
          description={`dalam periode ${format(startDate, "d MMM", { locale: id })} - ${format(endDate, "d MMM", { locale: id })}`}
          color="bg-sky-50 text-sky-600 border-sky-200"
        />
        <MetricCard
          title="Pendapatan Berulang Bulanan (MRR)"
          value={formatCurrency(metrics.monthlyRecurringRevenue)}
          description={`perkiraan dalam periode ${format(startDate, "d MMM", { locale: id })} - ${format(endDate, "d MMM", { locale: id })}`}
          color="bg-emerald-50 text-emerald-600 border-emerald-200"
        />
        <MetricCard
          title="Reaktivasi"
          value={metrics.reactivations.toLocaleString("id-ID")}
          description={`dalam periode ${format(startDate, "d MMM", { locale: id })} - ${format(endDate, "d MMM", { locale: id })}`}
          color="bg-amber-50 text-amber-600 border-amber-200"
        />
        <MetricCard
          title="Total Langganan Aktif"
          value={metrics.activeSubscriptions.toLocaleString("id-ID")}
          description="Total saat ini"
          color="bg-indigo-50 text-indigo-600 border-indigo-200"
        />
      </div>

      {/* Charts Section using Shadcn Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Langganan Baru vs. MRR (Bulanan)</CardTitle>
            <CardDescription>
              Grafik pertumbuhan langganan dari waktu ke waktu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* START: Perbaikan pada LineChart */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyChartData}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }} // Kurangi margin kiri dan kanan
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                {/* Atur interval sumbu X agar tidak tumpang tindih */}
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }} // Kurangi ukuran font
                  interval="preserveStartEnd" // Atur interval
                  angle={-45} // Putar label
                  textAnchor="end" // Posisikan di akhir
                  height={60} // Beri ruang ekstra untuk label yang diputar
                />
                <YAxis
                  yAxisId="left"
                  stroke="#8884d8"
                  tickFormatter={(value: number) => formatCurrency(value)}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={90} // Beri ruang ekstra untuk label mata uang
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={40} // Beri ruang ekstra
                />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "MRR (Rp)"
                      ? [formatCurrency(value), name] // Kembalikan array [formattedValue, name]
                      : [value.toLocaleString("id-ID"), name]
                  }
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="MRR (Rp)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="newSubscriptions"
                  stroke="#82ca9d"
                  name="Langganan Baru"
                />
              </LineChart>
            </ResponsiveContainer>
            {/* END: Perbaikan pada LineChart */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Langganan</CardTitle>
            <CardDescription>
              Persentase langganan berdasarkan status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* START: Perbaikan pada BarChart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statusChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }} // Kurangi margin
                layout="vertical" // Gunakan layout vertikal untuk menghindari tumpang tindih label
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="number" // Tipe number untuk sumbu X
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={40}
                />
                <YAxis
                  dataKey="name" // Gunakan 'name' untuk sumbu Y
                  type="category" // Tipe category
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={100} // Beri ruang ekstra untuk label status
                />
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "10px" }}
                />
                <Bar
                  dataKey="value"
                  fill="#82ca9d"
                  name="Jumlah Langganan"
                  barSize={20} // Kurangi ukuran bar
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            {/* END: Perbaikan pada BarChart */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Komponen MetricCard yang diperbarui menggunakan Shadcn Card
interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
}

function MetricCard({ title, value, description, color }: MetricCardProps) {
  return (
    <Card className={`border-2 p-6 ${color}`}>
      <CardHeader className="mb-2 p-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="mb-1 text-4xl font-bold">{value}</p>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
