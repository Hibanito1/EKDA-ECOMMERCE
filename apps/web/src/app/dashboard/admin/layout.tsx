"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Truck, Shield, AlertCircle,
  BarChart3, Wallet, FileText, Settings, Bell, LogOut, ChevronRight, ChevronLeft,
  Activity, MessageSquare, TrendingUp, Globe, Bot, Megaphone, Zap, Search,
  Moon, Sun, Download, Keyboard, Menu, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: string;
  section?: string;
};

const ADMIN_NAV: NavItem[] = [
  // Operations
  { href: "/dashboard/admin", label: "Command Center", icon: LayoutDashboard, section: "Operations" },
  { href: "/dashboard/admin/realtime", label: "Live Activity", icon: Activity, badge: "LIVE", badgeVariant: "success", section: "Operations" },
  { href: "/dashboard/admin/system", label: "System Health", icon: Zap, section: "Operations" },

  // Commerce
  { href: "/dashboard/admin/orders", label: "Orders", icon: ShoppingCart, badge: "238", section: "Commerce" },
  { href: "/dashboard/admin/escrow", label: "Escrow Center", icon: Shield, badge: "84M", section: "Commerce" },
  { href: "/dashboard/admin/disputes", label: "Disputes", icon: AlertCircle, badge: "23", badgeVariant: "error", section: "Commerce" },
  { href: "/dashboard/admin/financial", label: "Financial Controls", icon: Wallet, section: "Commerce" },

  // People
  { href: "/dashboard/admin/users", label: "Users", icon: Users, section: "People" },
  { href: "/dashboard/admin/kyc", label: "KYC Queue", icon: FileText, badge: "8", badgeVariant: "warning", section: "People" },
  { href: "/dashboard/admin/vendors", label: "Vendors", icon: Package, section: "People" },
  { href: "/dashboard/admin/carriers", label: "Carriers", icon: Truck, section: "People" },

  // Intelligence
  { href: "/dashboard/admin/analytics", label: "Analytics & BI", icon: BarChart3, section: "Intelligence" },
  { href: "/dashboard/admin/ai-monitor", label: "AI Supervision", icon: Bot, section: "Intelligence" },
  { href: "/dashboard/admin/marketing", label: "Marketing Tools", icon: TrendingUp, section: "Intelligence" },

  // Platform
  { href: "/dashboard/admin/announcements", label: "Announcements", icon: Megaphone, section: "Platform" },
  { href: "/dashboard/admin/export", label: "Reports & Export", icon: Download, section: "Platform" },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings, section: "Platform" },
];

const NAV_SECTIONS = ["Operations", "Commerce", "People", "Intelligence", "Platform"];

function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k": e.preventDefault(); document.getElementById("admin-search")?.focus(); break;
          case "d": e.preventDefault(); window.location.href = "/dashboard/admin"; break;
          case "u": e.preventDefault(); window.location.href = "/dashboard/admin/users"; break;
          case "o": e.preventDefault(); window.location.href = "/dashboard/admin/orders"; break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(5);

  useKeyboardShortcuts();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const Sidebar = () => (
    <aside
      className={cn(
        "flex flex-col bg-ekda-dark border-r border-white/5 transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-4 border-b border-white/10", collapsed && "justify-center px-2")}>
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-none">EKDA Admin</div>
            <div className="text-ekda-green-400 text-[10px] font-medium mt-0.5">Command Center</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto text-white/30 hover:text-white transition-colors", collapsed && "ml-0")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <Search className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
            <input
              id="admin-search"
              type="text"
              placeholder="Search... ⌘K"
              className="bg-transparent text-xs text-white/70 placeholder:text-white/25 outline-none flex-1"
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {NAV_SECTIONS.map((section) => {
          const sectionItems = ADMIN_NAV.filter((item) => item.section === section);
          return (
            <div key={section} className="mb-1">
              {!collapsed && (
                <div className="px-4 py-1.5 text-[9px] font-bold text-white/25 uppercase tracking-widest">
                  {section}
                </div>
              )}
              {sectionItems.map((item) => {
                const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/dashboard/admin");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 mx-2 px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-ekda-green-600/20 text-ekda-green-400"
                        : "text-white/45 hover:bg-white/5 hover:text-white/80",
                      collapsed && "justify-center px-0 w-10 mx-auto"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-ekda-green-400" : "text-white/40 group-hover:text-white/70")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            item.badgeVariant === "error" ? "bg-red-500/20 text-red-400" :
                            item.badgeVariant === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                            item.badgeVariant === "success" ? "bg-green-500/20 text-green-400" :
                            "bg-white/10 text-white/60"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={cn("flex items-center gap-3 px-2 py-2 rounded-xl text-xs text-white/40 hover:bg-white/5 hover:text-white/70 transition-all w-full", collapsed && "justify-center")}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button className={cn("flex items-center gap-3 px-2 py-2 rounded-xl text-xs text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all w-full", collapsed && "justify-center")}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  // Current page title
  const currentNav = ADMIN_NAV.find((n) => n.href === pathname || pathname?.startsWith(n.href + "/"));

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-muted-foreground text-sm hidden sm:block">Admin</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              <span className="font-semibold text-sm truncate">
                {currentNav?.label || "Dashboard"}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Keyboard shortcut hint */}
            <div className="hidden xl:flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/60 px-2 py-1 rounded-lg">
              <Keyboard className="h-3 w-3" />
              <span>⌘K search</span>
            </div>

            {/* LIVE indicator */}
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-600">LIVE</span>
            </div>

            {/* Notifications */}
            <button className="relative h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              {!collapsed && (
                <div className="hidden md:block text-right">
                  <div className="text-xs font-semibold">Super Admin</div>
                  <div className="text-[10px] text-muted-foreground">admin@ekda.io</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
