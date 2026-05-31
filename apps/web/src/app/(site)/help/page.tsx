import type { Metadata } from "next";
import { HelpCenter } from "@/components/support/HelpCenter";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get answers to your questions about EKDA Marketplace — shipping, escrow, KYC, payments, and more.",
};

export default function HelpPage() {
  return <HelpCenter />;
}
