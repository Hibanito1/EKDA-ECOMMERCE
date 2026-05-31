import Link from "next/link";
import { Globe, Mail, Phone, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  "Marketplace": [
    { label: "African Exports", href: "/marketplace/export" },
    { label: "Global Imports", href: "/marketplace/import" },
    { label: "Bulk Orders", href: "/marketplace/bulk" },
    { label: "Pricing", href: "/pricing" },
  ],
  "Sellers": [
    { label: "Sell on EKDA", href: "/vendors/register" },
    { label: "Vendor Dashboard", href: "/dashboard/vendor" },
    { label: "Product Guidelines", href: "/docs/products" },
    { label: "HS Code Tool", href: "/tools/hs-code" },
  ],
  "Logistics": [
    { label: "Compare Carriers", href: "/logistics" },
    { label: "Track Shipment", href: "/track" },
    { label: "Carrier Registration", href: "/carriers/register" },
    { label: "Port Information", href: "/docs/ports" },
  ],
  "Company": [
    { label: "About EKDA", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-ekda-dark dark:bg-ekda-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                EKDA
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              Africa&apos;s premier cross-border marketplace. Export African excellence. Import global innovation.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/ekda_io"
                className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/ekda_io"
                className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/ekda"
                className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com/@ekda"
                className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-white/80 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © 2025 EKDA Technologies Ltd. All rights reserved. RC: 1234567
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Globe className="h-3.5 w-3.5" />
            <span>Nigeria · United Kingdom · United States</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
