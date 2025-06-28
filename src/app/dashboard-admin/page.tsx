// dashboard-admin/page.tsx
import { redirect } from "next/navigation";
import { getUser } from "@/auth/server"; // Ambil helper getUser
import { getAdminMetrics, DashboardMetrics } from "@/action/adminDashboard"; // Impor Server Action admin
import AdminDashboardContent from "@/components/AdminDashboardContent"; // Kita akan buat komponen ini

export default async function AdminDashboardPage() {
  const user = await getUser();

  console.log(`[Server Component] User trying to access /dashboard-admin`);
  console.log(`[Server Component] User object:`, user);
  // Log sekarang akan menunjukkan properti 'role', bukan 'user_metadata.role'
  console.log(`[Server Component] User role: '${user?.role}'`);
  
  // --- PERBAIKAN DI SINI: Cek properti 'role' yang sudah diekstrak dari getUser() ---
  if (!user || user.role !== "admin") {
    redirect("/login"); // Atau ke halaman 'access-denied'
  }

  // Ambil data metrik default untuk periode saat ini atau terakhir
  // Contoh: Ambil metrik untuk bulan ini
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  let initialMetrics: DashboardMetrics = {
    newSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    reactivations: 0,
    activeSubscriptions: 0,
  };

  try {
    initialMetrics = await getAdminMetrics(firstDayOfMonth, lastDayOfMonth);
  } catch (error) {
    console.error("Failed to load initial admin metrics:", error);
    // Handle error, perhaps show a message on the dashboard or redirect
  }

  return (
    <div className="container mx-auto max-w-7xl p-8">
      {/* Meneruskan initialMetrics ke Client Component */}
      <AdminDashboardContent initialMetrics={initialMetrics} />
    </div>
  );
}