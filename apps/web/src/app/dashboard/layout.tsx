import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  FileText,
  Settings,
  Bell,
  LogOut,
  BarChart3,
  Shield,
  Wallet,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

type NavItem = {
  href: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  badge?: string;
};

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/orders", label: "Orders", icon: ShoppingCart, badge: "12" },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/vendors", label: "Vendors", icon: Package },
  { href: "/dashboard/admin/carriers", label: "Carriers", icon: Truck },
  { href: "/dashboard/admin/kyc", label: "KYC Review", icon: Shield, badge: "8" },
  { href: "/dashboard/admin/disputes", label: "Disputes", icon: AlertCircle, badge: "3" },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/payouts", label: "Payouts", icon: Wallet },
  { href: "/dashboard/admin/documents", label: "Documents", icon: FileText },
];

const VENDOR_NAV: NavItem[] = [
  { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/vendor/products", label: "Products", icon: Package },
  { href: "/dashboard/vendor/orders", label: "Orders", icon: ShoppingCart, badge: "5" },
  { href: "/dashboard/vendor/hs-codes", label: "HS Codes AI", icon: FileText },
  { href: "/dashboard/vendor/documents", label: "Documents", icon: Shield },
  { href: "/dashboard/vendor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/vendor/premium", label: "Premium Plan", icon: Wallet },
  { href: "/dashboard/vendor/wallet", label: "Wallet", icon: Wallet },
];

const CARRIER_NAV: NavItem[] = [
  { href: "/dashboard/carrier", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/carrier/jobs", label: "Available Jobs", icon: Package, badge: "14" },
  { href: "/dashboard/carrier/bids", label: "My Bids", icon: ShoppingCart },
  { href: "/dashboard/carrier/active", label: "Active Shipments", icon: Truck, badge: "3" },
  { href: "/dashboard/carrier/history", label: "History", icon: BarChart3 },
  { href: "/dashboard/carrier/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/carrier/documents", label: "Documents", icon: FileText },
];

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingCart },
  { href: "/dashboard/customer/track", label: "Track Shipment", icon: Truck },
  { href: "/dashboard/customer/loyalty", label: "Loyalty & Rewards", icon: BarChart3 },
  { href: "/dashboard/customer/wishlist", label: "Wishlist", icon: Package },
  { href: "/dashboard/customer/addresses", label: "Addresses", icon: FileText },
  { href: "/dashboard/customer/wallet", label: "Wallet", icon: Wallet },
];

function DashboardSidebar({ role, pathname }: { role: string; pathname: string }) {
  const navItems = {
    admin: ADMIN_NAV,
    vendor: VENDOR_NAV,
    carrier: CARRIER_NAV,
    customer: CUSTOMER_NAV,
  }[role] || CUSTOMER_NAV;

  const roleInfo = {
    admin: { label: "EKDA Admin", icon: "⚡", color: "from-ekda-green-700 to-ekda-green-900" },
    vendor: { label: "Vendor Portal", icon: "🏪", color: "from-ekda-earth-600 to-ekda-earth-800" },
    carrier: { label: "Carrier Hub", icon: "🚢", color: "from-blue-600 to-blue-800" },
    customer: { label: "My Account", icon: "🛍️", color: "from-slate-600 to-slate-800" },
  }[role] || { label: "Dashboard", icon: "📦", color: "from-slate-600 to-slate-800" };

  return (
    <aside className="w-64 flex-shrink-0 bg-ekda-dark min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg">EKDA</span>
            <div className={`text-[10px] bg-gradient-to-r ${roleInfo.color} bg-clip-text text-transparent font-medium`}>
              {roleInfo.label}
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="h-5 min-w-5 px-1 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardLayout({ children }: any) {
  // In production, get role from session
  const role = "vendor"; // placeholder — derive from server session

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar role={role} pathname="/dashboard/vendor" />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground">
              Welcome back, Kingsley 👋
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center text-white text-sm font-bold">
              KE
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
