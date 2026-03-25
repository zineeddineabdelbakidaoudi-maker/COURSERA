"use client"

import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle2, ShieldCheck, FileText, DollarSign } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"
import { Badge } from "@/components/ui/badge"

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore()
  
  const fee = items.length > 0 ? 500 : 0
  const total = subtotal + fee

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl animate-slide-up">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred payment method below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            {/* Payment Methods */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
              
              {/* Cash on Delivery (Active) */}
              <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer shadow-premium transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Cash on Delivery (COD)</h4>
                    <p className="text-sm text-muted-foreground">Pay when you receive your service</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
              </label>

              {/* CIB / Edahabia Card Selection (Coming Soon) */}
              <div className="relative group overflow-hidden rounded-2xl border border-border grayscale-[0.5] opacity-60">
                <div className="flex items-center justify-between p-5 bg-card/50 blur-[1px]">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center" />
                    <div>
                      <p className="font-semibold text-foreground">CIB / Edahabia</p>
                      <p className="text-sm text-muted-foreground">Local Algerian Cards</p>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                  <Badge variant="secondary" className="px-3 py-1 bg-background/80 text-foreground border-border shadow-sm font-medium">Coming Soon</Badge>
                </div>
              </div>

              {/* Stripe / International Card Selection (Coming Soon) */}
              <div className="relative group overflow-hidden rounded-2xl border border-border grayscale-[0.5] opacity-60">
                <div className="flex items-center justify-between p-5 bg-card/50 blur-[1px]">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center" />
                    <div>
                      <p className="font-semibold text-foreground">Credit Card (Stripe)</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, etc.</p>
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                  <Badge variant="secondary" className="px-3 py-1 bg-background/80 text-foreground border-border shadow-sm font-medium">Coming Soon</Badge>
                </div>
              </div>

              {/* Checkout Form Simulation */}
              <div className="bg-card p-6 rounded-2xl border border-border mt-8">
                <h4 className="font-medium text-foreground mb-4">Billing Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input type="text" className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                    <input type="email" className="w-full h-11 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="john@example.com" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-premium">
              <h3 className="text-xl font-semibold mb-6">Final Details</h3>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{items.length} Items in Cart</p>
                    <Link href="/cart" className="text-primary hover:underline text-xs">Edit Cart</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-foreground">Total to Pay</span>
                <span className="font-mono font-bold text-3xl text-primary">{total.toLocaleString('en-US')} DZD</span>
              </div>

              <Link href="/checkout/success" className="block w-full">
                <Button size="lg" className="w-full h-14 rounded-xl gradient-primary text-white shadow-glow text-base">
                  Pay {total.toLocaleString('en-US')} DZD
                </Button>
              </Link>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>Invoice sent automatically via email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
