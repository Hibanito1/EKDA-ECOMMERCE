import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "EKDA — Africa's Premier Cross-Border Marketplace",
    template: "%s | EKDA",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EKDA",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "https://ekda.io",
    languages: { "en-US": "https://ekda.io/en", "yo-NG": "https://ekda.io/yo" },
  },
  category: "shopping",
  description:
    "Shop African groceries, dried produce, and commodities worldwide. Import cars, electronics, and machinery to Nigeria. Powered by smart logistics and AI compliance.",
  keywords: [
    "african groceries",
    "import Nigeria",
    "export Africa",
    "diaspora shopping",
    "logistics",
    "escrow",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ekda.io",
    siteName: "EKDA",
    title: "EKDA — Africa's Premier Cross-Border Marketplace",
    description:
      "Shop African groceries, dried produce, and commodities worldwide. Import cars, electronics, and machinery to Nigeria.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ekda_io",
    creator: "@ekda_io",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a2744",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
