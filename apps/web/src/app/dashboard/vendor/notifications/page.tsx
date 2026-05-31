import type { Metadata } from "next";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";

export const metadata: Metadata = { title: "Notification Preferences" };

export default function VendorNotificationsPage() {
  return (
    <div className="py-6">
      <NotificationPreferences />
    </div>
  );
}
