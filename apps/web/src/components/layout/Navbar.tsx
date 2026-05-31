"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Globe,
  Truck,
  Shield,
  Zap,
  User,
  Bell,
  Search,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    label: "African Exports",
    href: "/marketplace/export",
    icon: "🌿",
    description: "Groceries, dried produce, agri commodities",
  },
  {
    label: "Global Imports",
    href: "/marketplace/import",
    icon: "🌍",
    description: "Cars, electronics, machinery to Nigeria",
  },
  {
    label: "Logistics",
    href: "/logistics",
    icon: "🚢",
    description: "Compare carriers, track shipments",
  },
  {
    label: "B2B",
    href: "/b2b",
    icon: "🏗️",
    description: "Enterprise & bulk buyer portal",
  },
  {
    label: "Learn",
    href: "/learn",
    icon: "📚",
    description: "Free trade courses & guides",
  },
  {
    label: "Green Trade",
    href: "/sustainability",
    icon: "🌱",
    description: "Carbon offset & farmer support",
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/10 bg-white/80 dark:bg-ekda-dark/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center shadow-lg group-hover:shadow-ekda-green-600/30 transition-shadow">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-foreground">
                EKDA
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname?.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hidden md:flex">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                3
              </Badge>
            </Button>
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="premium" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{link.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {link.description}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="pt-2 flex gap-2">
                  <Link href="/auth/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1">
                    <Button variant="premium" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
