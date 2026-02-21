import { DashboardLayoutContent } from "@/components/layout/dashboard-layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // Treat as possibly async (Next 15+)
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/auth/login");
  }

  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
