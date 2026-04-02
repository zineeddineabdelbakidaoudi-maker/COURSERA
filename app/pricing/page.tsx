import React from "react"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pricing & Fees | Digit Hup",
  description: "Transparent pricing for buyers and sellers on Digit Hup.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground mb-16">No hidden fees. We only make money when you make money.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            {/* Buyer Card */}
            <div className="p-8 bg-card rounded-3xl border border-border shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl font-bold">0%</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">For Buyers</h3>
              <p className="text-muted-foreground mb-8">Buying services or tools</p>
              <div className="text-5xl font-display font-bold mb-6">0 DZD <span className="text-lg text-muted-foreground font-sans font-normal">/ month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">✓ Access to 1000+ top freelancers</li>
                <li className="flex items-center gap-2">✓ Secure CIB/Edahabia payments</li>
                <li className="flex items-center gap-2">✓ 24/7 Support mediation</li>
                <li className="flex items-center gap-2">✓ Only pay standard 5% platform fee per order</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12">Start Buying</Button>
            </div>

            {/* Seller Card */}
            <div className="p-8 bg-card rounded-3xl border-2 border-primary shadow-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="text-9xl font-bold">15%</span>
              </div>
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <h3 className="text-2xl font-bold mb-2">For Sellers</h3>
              <p className="text-muted-foreground mb-8">Selling services or tools</p>
              <div className="text-5xl font-display font-bold mb-6">Free <span className="text-lg text-muted-foreground font-sans font-normal">to join</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">✓ Unlimited service listings</li>
                <li className="flex items-center gap-2">✓ Payouts directly to your bank account</li>
                <li className="flex items-center gap-2">✓ Marketing tools and analytics</li>
                <li className="flex items-center gap-2 font-semibold">★ Standard 15% fee only on successful orders</li>
              </ul>
              <Button className="w-full hover:bg-primary/90 text-white rounded-full h-12 bg-accent shadow-glow transition-all">Become a Seller</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
