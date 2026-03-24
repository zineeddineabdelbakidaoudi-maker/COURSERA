"use client"

import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight, Package, Trash2, Tag, CheckCircle2 } from "lucide-react"
import { useCartStore } from "@/store/useCartStore"

export default function CartPage() {
  const { items: cartItems, removeItem, subtotal } = useCartStore()
  
  const fee = cartItems.length > 0 ? 500 : 0 // Platform fee mock
  const total = subtotal + fee

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-foreground">
            Your Cart <span className="text-muted-foreground font-sans text-xl font-normal ml-2">({cartItems.length} items)</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-border bg-card">
                  {/* Item Image */}
                  <div className="w-full sm:w-32 h-24 rounded-xl bg-secondary/50 overflow-hidden flex-shrink-0 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {item.type}
                        </span>
                        <h3 className="font-semibold text-foreground leading-snug line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                      </div>
                      <p className="font-mono font-bold text-lg whitespace-nowrap">
                        {item.price.toLocaleString('en-US')} DZD
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-end mt-4 sm:mt-0">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-foreground">{subtotal.toLocaleString('en-US')} DZD</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Platform Fee</span>
                    <span className="font-mono font-medium text-foreground">{fee.toLocaleString('en-US')} DZD</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Promo code" 
                      className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <Button variant="secondary" className="h-10">Apply</Button>
                </div>

                <div className="pt-4 border-t border-border mb-8 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-mono font-bold text-2xl text-foreground">{total.toLocaleString('en-US')} DZD</span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full rounded-xl gradient-primary text-white shadow-glow">
                    Secure Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full bg-success/20 flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-success" /></span>
                  Guaranteed safe & secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
