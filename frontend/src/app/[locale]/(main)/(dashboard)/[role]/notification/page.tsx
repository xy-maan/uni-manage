import NotificationsPageClient from "@/app/[locale]/_Components/NotificationsPageClient";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Notifications",
};
export default async function NotificationsPage({
  params,
}: {
  params: Promise<{role:string }>;
}) {
    const { role } = await params;

  return (
    <NotificationsPageClient role={role}/> 
  );
}