import { redirect } from "next/navigation";
import { getUser } from "@/auth/server";
import { getUserSubscriptions } from "@/action/userDashboard";
import { SubscriptionList } from "../dashboard-user/SubscriptionList";

export default async function UserDashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const subscriptions = await getUserSubscriptions();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto max-w-4xl p-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Dashboard Langganan Anda
        </h1>
        <SubscriptionList initialSubscriptions={subscriptions} />
      </div>
    </div>
  );
}
