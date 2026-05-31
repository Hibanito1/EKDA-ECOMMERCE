import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your EKDA account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-ekda-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-ekda-gold-500/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(60deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 10px)`,
            }}
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-white font-bold text-2xl">EKDA</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Trade Across <br />
            <span className="text-ekda-gold-400">Africa & Beyond</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Africa&apos;s most trusted cross-border marketplace. Export excellence.
            Import innovation. Protected by escrow.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: "🛡️", text: "100% Escrow Protection on all orders" },
              { icon: "🤖", text: "AI-powered HS Code & customs compliance" },
              { icon: "🚢", text: "Global carrier network, 120+ countries" },
              { icon: "💱", text: "Multi-currency: NGN, USD, GBP, EUR" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/70 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/30 text-sm">
          © 2025 EKDA Technologies Ltd.
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
